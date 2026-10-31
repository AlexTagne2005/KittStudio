"""Modèle SQLAlchemy représentant une transaction de crédits."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.db.database import Base

class Transaction(Base):
    """Représente un mouvement dans le ledger de crédits d'un Workspace (Achat ou Dépense).

    Attributes:
        id (int): Identifiant unique de la transaction.
        workspace_id (int): ID du workspace concerné.
        amount (int): Valeur en crédits (Positif = Rechargement/Achat, Négatif = Consommation/Génération).
        description (str): Détail de l'opération (ex: "Génération de 4 images" ou "Recharge Stripe").
        created_at (datetime): Date et heure de la transaction.
        workspace (Workspace): Le workspace concerné par ce mouvement.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    amount = Column(Integer, nullable=False) # Credits (positive for top-up, negative for usage)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    workspace = relationship("Workspace", back_populates="transactions")
