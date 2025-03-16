from abc import abstractmethod


class ApiStrategy:    
    @staticmethod
    def make_resp(body, execution_status, status_code, message):
        return {
            "body": body,
            "execution_status": execution_status,
            "status_code": status_code,
            "message":message
        }

    @abstractmethod
    def validate_payload():
        pass

    @abstractmethod
    def execute():
        pass