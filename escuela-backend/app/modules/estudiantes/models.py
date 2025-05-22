import uuid
from datetime import date
from sqlalchemy import Column, String, ForeignKey, Date, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from app.db.base_class import Base


class Estudiante(Base):
    __tablename__ = "estudiante"
    id_estudiante = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), nullable=False)
    id_padre = Column(PostgresUUID(as_uuid=True), ForeignKey("usuario.id_usuario"), nullable=True)


class Matricula(Base):
    __tablename__ = "matricula"
    id_matricula = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_estudiante = Column(PostgresUUID(as_uuid=True), ForeignKey("estudiante.id_estudiante", ondelete="CASCADE"), nullable=False)
    id_seccion = Column(PostgresUUID(as_uuid=True), ForeignKey("seccion.id_seccion", ondelete="CASCADE"), nullable=False)
    id_anio = Column(PostgresUUID(as_uuid=True), ForeignKey("anio_lectivo.id_anio"), nullable=False)
    fecha_matricula = Column(Date, default=date.today)
    
    __table_args__ = (UniqueConstraint('id_estudiante', 'id_anio', name='uq_estudiante_anio'),)
