from enum import Enum, auto

class Operation(Enum):
    CREATE_VACANCY = auto()
    GET_VACANCIES = auto()
    GET_VACANCY = auto()
    ANSWER_QUESTION = auto()
    GET_QUESTIONS = auto()
    EXPLAIN = auto()
    GENERATE_VACANCY = auto()
    ECHO = auto()

    @staticmethod
    def from_str(label: str):
        label = label.lower()
        if label == 'create_vacancy':
            return Operation.CREATE_VACANCY
        elif label == 'get_vacancies':
            return Operation.GET_VACANCIES
        elif label == 'get_vacancy':
            return Operation.GET_VACANCY
        elif label == 'answer_question':
            return Operation.ANSWER_QUESTION
        elif label == 'get_questions':
            return Operation.GET_QUESTIONS
        elif label == 'echo':
            return Operation.ECHO
        elif label == 'explain':
            return Operation.EXPLAIN
        elif label == 'generate_vacancy':
            return Operation.GENERATE_VACANCY
        else:
            raise ValueError(f"Unknown operation: {label}")