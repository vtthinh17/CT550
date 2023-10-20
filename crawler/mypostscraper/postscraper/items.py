import scrapy


class PostscraperItem(scrapy.Item):
    # define the fields for your item here like:
    job_title = scrapy.Field()
    logo = scrapy.Field()
    company = scrapy.Field()
    job_description = scrapy.Field()
    job_requirement = scrapy.Field()
    job_benefit = scrapy.Field()
    com_location = scrapy.Field()
    com_phone = scrapy.Field()
    deadline = scrapy.Field()
    job_link = scrapy.Field()
    job_salary = scrapy.Field()
    province = scrapy.Field()
    workingType = scrapy.Field()
    major = scrapy.Field()
    expRequire = scrapy.Field()
    educationRequire = scrapy.Field()


