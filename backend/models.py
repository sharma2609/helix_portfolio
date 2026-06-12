from pydantic import BaseModel


class Socials(BaseModel):
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""


class PersonalInfo(BaseModel):
    name: str = ""
    role: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    socials: Socials = Socials()


class Experience(BaseModel):
    title: str = ""
    company: str = ""
    period: str = ""
    description: str = ""
    highlights: list[str] = []
    skills: list[str] = []


class Project(BaseModel):
    name: str = ""
    type: str = ""
    domain: str = ""
    description: str = ""
    techStack: list[str] = []
    features: list[str] = []


class Education(BaseModel):
    degree: str = ""
    field: str = ""
    institution: str = ""
    year: str = ""
    details: str = ""


class Skills(BaseModel):
    programming: list[str] = []
    ai_ml: list[str] = []
    libraries: list[str] = []
    tools: list[str] = []
    webDev: list[str] = []
    databases: list[str] = []
    core: list[str] = []


class PortfolioData(BaseModel):
    personalInfo: PersonalInfo = PersonalInfo()
    experience: list[Experience] = []
    projects: list[Project] = []
    education: list[Education] = []
    skills: Skills = Skills()
    achievements: list[str] = []
