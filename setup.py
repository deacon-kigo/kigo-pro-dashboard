#!/usr/bin/env python3

from setuptools import setup, find_packages

setup(
    name="kigo-pro-backend",
    version="0.1.0",
    description="Kigo Pro LangGraph Backend",
    packages=find_packages(),
    install_requires=[
        "langgraph",
        "langchain",
        "langchain-openai",
        "fastapi",
        "uvicorn",
        "pydantic",
        "httpx",
    ],
    python_requires=">=3.8",
)