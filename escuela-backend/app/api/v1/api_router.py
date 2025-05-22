from fastapi import APIRouter
from app.api.v1 import auth, usuario, materia, seccion, anio_lectivo, profesor, estudiante

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

api_router.include_router(
    profesor.router,
    prefix="/profesores",
    tags=["Profesores"]
)

api_router.include_router(
    materia.router,
    prefix="/materias",
    tags=["Materias"]
)

api_router.include_router(
    seccion.router,
    prefix="/secciones",
    tags=["Secciones"]
)

api_router.include_router(
    anio_lectivo.router,
    prefix="/anios-lectivos",
    tags=["Años Lectivos"]
)

api_router.include_router(
    estudiante.router,
    prefix="/estudiantes",
    tags=["Estudiantes"]
)
