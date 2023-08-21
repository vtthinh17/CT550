import scrapy
import json  
from scrapy import cmdline
from ..items import PostscraperItem
items = PostscraperItem()
import datetime
class PostSpider(scrapy.Spider):
    name = 'posts'
    pageCrawl = 2
    def create_filename():
        basename = "mylogfile"
        suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
        filename = "_".join([basename, suffix]) # e.g. 'mylogfile_120508_171442'
        return filename
    def start_requests(self):
        yield scrapy.Request('https://vieclamcantho.com.vn/viec-lam-moi-nhat?ts=1&sort2=3&page=1', self.parse1)
        yield scrapy.Request('https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page=1&province_ids%5B%5D=131', self.parse2)

    def parse1_attr(self, response):
        items["job_title"] = response.css('.card .card-body >h6::text').extract()
        items["job_links"] = response.url
        dulieu = response.css(".card .card-body .card-list p:first-child::text").extract()
        items["job_salary"] = dulieu[2]
        items['logo'] = response.css('.card .card-avatar >a::attr(href)').extract()
        items['company'] = response.css('.card .card-body p.card-text>a::text').extract()
        items['job_description'] = response.css('.recruitment-content .recruitment-job .description-content::text').extract()
        items['job_requirement'] = response.css('.recruitment-content .recruitment-required-job .description-content::text').extract()
        items['job_benefit'] = response.css('.recruitment-content .recruitment-benefit .description-content > p::text').extract()
        items['deadline_apply'] = response.css('.recruitment-content .recruitment-apply .apply-contact div.apply-contact-item::text').extract()
    # # #     items['contact_location'] = response.css('.recruitment-content .recruitment-required-profile .description-content .mt-2 > div::text').extract()
    # # #     items['contact_phone'] = response.css('.recruitment-content .recruitment-required-profile .description-content .mt-2:nth-child(3) > div > a::text').extract()
    # # #     # items['item-id'] = response.css('.data-id').extract()
           
       
        yield items
    #
    #
    def parse1(self, response):
    # #     # pages = response.css('.pagination .page-link ::text').extract()
        posts = response.css('.search-item')
        for post in posts:
            links = post.css(' div.search-name > a::attr(href)').extract()
            for url in links:
                yield scrapy.Request(url, callback=self.parse1_attr)
    # # # #     # next_page = 'https://vieclamcantho.com.vn/viec-lam-moi-nhat?ts=1&sort2=3&page='+str(PostSpider.pageCrawl)
    # # # #     # if PostSpider.pageCrawl <= 2:
    # # # #     #     PostSpider.pageCrawl += 1
    # # # #     #     yield response.follow(next_page, callback=self.parse)


    def parse2(self, response):
        urls = response.css('div.relative > a.relative::attr(href)').extract()
        # posts = response.css('.job-item')
        for url in urls:
        #         #     links = post.css(' .figcaption .title >h2 >a::attr(href)').extract()
        #         #     for url in links:
            yield scrapy.Request("https://vieclam24h.vn"+str(url), callback=self.parse2_attr)
        #
    def parse2_attr(self, response):
        items["job_title"] = response.css("main > div .bg-white.shadow-sd-12.rounded-sm.mb-5  .w-full.items-start > div > h1 ::text").extract()
        items["job_links"] = response.url
        items["company"] = response.css("main > div > div.py-3.px-4.bg-white.shadow-sd-12.rounded-sm.mb-5 > div > div > a > h3::text").extract()
        items['logo'] = response.css('.w-full.items-start > img::attr(src)').extract()
        data = response.css("main > div >.bg-white.shadow-sd-12.rounded-sm.mb-5 > div.w-full.items-start > div > div.mt-5 > div.flex.mb-4 div > p:nth-child(2)::text").extract()
        items['deadline_apply'] = data[1]
        items['job_salary'] = data[0]
        items['job_description'] = response.css('main > div div.w-full > div.jsx-d84db6a84feb175e.bg-white.shadow-sd-12.rounded-sm > div:nth-child(3) > div >p::text').extract()
        items['job_benefit'] = response.css('main div.w-full> div.jsx-d84db6a84feb175e  > div:nth-child(5) > div >p::text').extract()
        ab = response.css("main > div > div.flex.flex-col > div.w-full.pb-4 > div.jsx-d84db6a84feb175e.px-4.py-4.bg-white.shadow-sd-12.rounded-sm > div.jsx-d84db6a84feb175e.mb-4 > div  p::text").extract()
        items['job_requirement'] = ab
        yield items
    # with open('data.json', 'w', encoding='utf-8') as f:
    #         json.dump(items, f, ensure_ascii=False, indent=4)
# def crawl_posts():
#       cmdline.execute("scrapy crawl posts")

# if __name__ == '__main__':
#     crawl_posts()