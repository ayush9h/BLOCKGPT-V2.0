import os

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

VECTOR_DB_PATH = "./app/vector_store/faiss_index"


def retrieve_context(question: str):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    
    vector_store = FAISS.load_local(
        VECTOR_DB_PATH, embeddings, allow_dangerous_deserialization=True
    )

    retrieved_docs = vector_store.similarity_search(question, k = 1)

    context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)

    return {"context": context_text}
