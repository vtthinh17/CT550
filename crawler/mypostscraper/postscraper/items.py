import scrapy


class PostscraperItem(scrapy.Item):
    # define the fields for your item here like:
    job_title = scrapy.Field()
    logo = scrapy.Field()
    company = scrapy.Field()
    job_description = scrapy.Field()
    job_requirement = scrapy.Field()
    job_benefit = scrapy.Field()
    contact_location = scrapy.Field()
    contact_phone = scrapy.Field()
    deadline_apply = scrapy.Field()
    job_links = scrapy.Field()
    job_salary = scrapy.Field()


