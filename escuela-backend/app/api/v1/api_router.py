from fastapi import APIRouter
from app.api.v1 import auth, usuario

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Autenticación"]
)

api_router.include_router(
    usuario.router,
    prefix="/usuarios",
    tags=["Usuarios"]
)
