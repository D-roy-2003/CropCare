from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms
import numpy as np
import io
import json
import logging
import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Plant Disease Classifier API",
    description="Vision Transformer Model for Plant Disease Detection",
    version="1.0.0"
)

# Configuration
MODEL_PATH = "../ml_models/vit_model_version_one.pth"
CLASS_NAMES_PATH = "../ml_models/class_names.json"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = 224

# Preprocessing transformation
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Vision Transformer Model Definition
class VisionTransformer(nn.Module):
    def __init__(self, num_classes=38):
        super().__init__()
        self.vit = torch.hub.load('facebookresearch/deit:main', 
                                  'deit_base_patch16_224', pretrained=False)
        self.vit.head = nn.Linear(self.vit.head.in_features, num_classes)
    
    def forward(self, x):
        return self.vit(x)

# Load class names during startup
@app.on_event("startup")
async def load_class_mapping():
    try:
        with open(CLASS_NAMES_PATH) as f:
            class_data = json.load(f)
            
        # Convert to index-class mapping
        if isinstance(class_data, list):
            app.state.idx_to_class = {i: name for i, name in enumerate(class_data)}
        elif isinstance(class_data, dict):
            app.state.idx_to_class = {int(k): v for k, v in class_data.items()}
        else:
            raise ValueError("Invalid class names format")
            
        logger.info(f"Loaded {len(app.state.idx_to_class)} classes from {CLASS_NAMES_PATH}")
        
    except Exception as e:
        logger.exception(f"Class mapping failed: {str(e)}")
        raise RuntimeError("Could not load class names")

# Load model during startup
@app.on_event("startup")
async def load_model():
    try:
        # Ensure class mapping is loaded first
        if not hasattr(app.state, 'idx_to_class'):
            await load_class_mapping()
            
        num_classes = len(app.state.idx_to_class)
        
        # Initialize model architecture
        app.state.model = VisionTransformer(num_classes=num_classes)
        
        # Load weights
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
        else:
            state_dict = checkpoint
            
        cleaned_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('vit.'):
                cleaned_state_dict[k[len('vit.'):]] = v
            else:
                cleaned_state_dict[k] = v

        app.state.model.vit.load_state_dict(cleaned_state_dict, strict=False)
        app.state.model.to(DEVICE)
        app.state.model.eval()
        
        logger.info(f"Model loaded successfully on {DEVICE}")
        logger.info(f"Class mapping: {len(app.state.idx_to_class)} classes")
        
    except Exception as e:
        logger.exception(f"Model loading failed: {str(e)}")
        raise RuntimeError("Could not initialize model")

# Configure Gemini API - UPDATED
@app.on_event("startup")
async def configure_gemini():
    try:
        # Try loading from both possible locations
        env_paths = [
            Path('.env.local'),  # Backend directory
            Path('../.env.local')  # Project root
        ]
        
        loaded = False
        for path in env_paths:
            if path.exists():
                load_dotenv(dotenv_path=path)
                logger.info(f"Loaded environment variables from {path}")
                loaded = True
                break
        
        if not loaded:
            logger.warning("No .env.local file found in expected locations")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        
        genai.configure(api_key=api_key)
        
        # Try different model names with fallbacks
        model_names = [
            'gemini-1.5-flash-latest',  # Newest fast model
            'gemini-1.5-pro-latest',    # Newest pro model
            'gemini-pro',                # Legacy name
            'models/gemini-pro'          # Fully qualified name
        ]
        
        app.state.gemini_model = None
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                # Test a simple prompt to verify the model works
                test_response = model.generate_content("What is 2+2?")
                if test_response.text and "4" in test_response.text:
                    app.state.gemini_model = model
                    logger.info(f"Successfully initialized Gemini with model: {model_name}")
                    break
                else:
                    logger.warning(f"Model {model_name} test failed: {test_response.text}")
            except Exception as e:
                logger.warning(f"Model {model_name} failed: {str(e)}")
                
        if not app.state.gemini_model:
            raise RuntimeError("All Gemini models failed to initialize")
            
    except Exception as e:
        logger.error(f"Gemini configuration failed: {str(e)}")
        app.state.gemini_model = None

# GEMINI TEST ENDPOINT - ADD THIS SECTION
@app.get("/test-gemini")
async def test_gemini():
    """Test endpoint for Gemini API connection"""
    try:
        if not hasattr(app.state, 'gemini_model') or not app.state.gemini_model:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Gemini not configured"}
            )
        
        test_prompt = "What is the capital of France?"
        response = app.state.gemini_model.generate_content(test_prompt)
        
        if not response.text:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Empty response from Gemini"}
            )
            
        return {
            "status": "success",
            "model": "Gemini",
            "prompt": test_prompt,
            "response": response.text
        }
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

def predict_image(image_tensor: torch.Tensor) -> list:
    """Run model inference on preprocessed image"""
    try:
        with torch.no_grad():
            inputs = image_tensor.unsqueeze(0).to(DEVICE)
            outputs = app.state.model(inputs)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            top3_prob, top3_idx = torch.topk(probabilities, 3)
            
            results = []
            for i, idx in enumerate(top3_idx.cpu().numpy()):
                class_name = app.state.idx_to_class[idx]
                confidence = top3_prob[i].item() * 100
                results.append({
                    "class": class_name,
                    "confidence": round(confidence, 2)
                })
                
            return results
            
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise RuntimeError("Model inference error")

def preprocess_image(image: Image.Image) -> torch.Tensor:
    """Convert PIL image to preprocessed tensor"""
    try:
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return transform(image)
        
    except Exception as e:
        logger.error(f"Image processing failed: {str(e)}")
        raise HTTPException(status_code=422, detail="Invalid image format")

# Improved Gemini prompt and response handling
def generate_gemini_content(disease_name: str) -> tuple:
    """Generate Gemini content with improved prompting and error handling"""
    try:
        # Create a more structured prompt
        prompt = f"""
        You are an expert plant pathologist. For the plant disease "{disease_name}", provide:
        
        1. SEVERITY: [Low/Medium/High] - Brief severity assessment
        2. TREATMENT: Practical treatment recommendations (1 paragraph)
        3. PREVENTION: Effective prevention tips (1 paragraph)
        
        Use concise language suitable for home gardeners. Output exactly in this format:
        
        Severity: [your severity assessment]
        Treatment: [your treatment recommendations]
        Prevention: [your prevention tips]
        """
        
        logger.info(f"Sending prompt to Gemini for disease: {disease_name}")
        response = app.state.gemini_model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Empty response from Gemini")
        
        logger.info(f"Gemini response: {response.text}")
        
        # Parse the structured response
        severity = "Failed to generate severity."
        treatment = "Failed to generate treatment advice."
        prevention = "Failed to generate prevention tips."
        
        # Extract sections using the expected headers
        response_text = response.text.replace("**", "")  # Remove markdown bold
        
        if "Severity:" in response_text:
            severity = response_text.split("Severity:")[1].split("\n")[0].strip()
        if "Treatment:" in response_text:
            treatment = response_text.split("Treatment:")[1].split("Prevention:")[0].strip()
        if "Prevention:" in response_text:
            prevention = response_text.split("Prevention:")[1].strip()
        
        return severity, treatment, prevention
        
    except Exception as e:
        logger.error(f"Gemini content generation failed: {str(e)}")
        return ("Failed to generate severity.", 
                "Failed to generate treatment advice.", 
                "Failed to generate prevention tips.")

@app.post("/predict", response_class=JSONResponse)
async def predict(file: UploadFile = File(...)):
    """Endpoint for plant disease classification"""
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
            
        image = Image.open(io.BytesIO(contents))
        processed_tensor = preprocess_image(image)
        predictions = predict_image(processed_tensor)
        
        # Get the top prediction
        top_prediction = predictions[0]["class"] if predictions else "Unknown disease"
        
        # Initialize default values
        severity_paragraph = "Failed to generate severity."
        treatment_paragraph = "Failed to generate treatment advice."
        prevention_paragraph = "Failed to generate prevention tips."

        # Only call Gemini if configured
        if hasattr(app.state, 'gemini_model') and app.state.gemini_model:
            try:
                severity_paragraph, treatment_paragraph, prevention_paragraph = generate_gemini_content(top_prediction)
            except Exception as gemini_e:
                logger.error(f"Gemini API call failed: {str(gemini_e)}")
        else:
            logger.warning("Gemini model not configured, skipping API call")

        return {
            "filename": file.filename,
            "predictions": predictions,
            "model": "Vision Transformer",
            "input_size": IMG_SIZE,
            "gemini_severity": severity_paragraph,
            "gemini_treatment": treatment_paragraph,
            "gemini_prevention": prevention_paragraph
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],  # Added GET for test endpoint
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)