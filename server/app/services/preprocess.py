import os

from app.utils.logger import logger
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from tqdm import tqdm


def preprocess_and_store():
    logger.info("Loading the CSV file")
    loader = CSVLoader(
        file_path="./app/data/cryptodata1.csv",
        csv_args={
            "fieldnames": [
                "description",
            ],
        },
        encoding="utf-8",
    )

    docs = loader.load()

    logger.info("Text Splitting")
    text_splitter = CharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=0,
    )

    all_splits = text_splitter.split_documents(docs)
    
    logger.info("Generating Embeddings")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

    vector_store = None
    with tqdm(total=len(all_splits), desc="Ingesting Documents") as pbar:
        for d in all_splits:
            if vector_store:
                vector_store.add_documents([d])
            else:
                vector_store = FAISS.from_documents(documents=all_splits, embedding=embeddings)

            pbar.update(1)

    logger.info("Saving to vectorstore")
    vector_store.save_local("./app/vector_store/faiss_index")

    logger.info("Preprocessing Complete")


if __name__ == "__main__":
    preprocess_and_store()
