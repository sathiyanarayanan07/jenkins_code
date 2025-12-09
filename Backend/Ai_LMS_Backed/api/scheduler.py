from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from .enrollment import enroll_students_function

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(
        enroll_students_function,
        "interval",
        minutes=30,  
        name="Daily student enrollment",
        replace_existing=True,
    )
    scheduler.start()