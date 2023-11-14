import scrapy
import json  
from scrapy import cmdline
from ..items import PostscraperItem
items = PostscraperItem()
import pandas as pd
import datetime
class PostSpider(scrapy.Spider):
    name = 'posts'
    pageCrawlOfViecLamCT = 2
    pageCrawlOfCareerLink = 2
    # def create_filename():
    #     basename = "mylogfile"
    #     suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
    #     filename = "_".join([basename, suffix]) # e.g. 'mylogfile_120508_171442'
    #     return filename
    def start_requests(self):
        yield scrapy.Request('https://vieclamcantho.com.vn/viec-lam-moi-nhat?ts=1&sort2=3&page=1', self.parse1)
        yield scrapy.Request('https://www.careerlink.vn/vieclam/list?order=posted_date&page=2&sort=desc', self.parse2)
    def parse1_attr(self, response):
        items['status']=1
        items["job_title"] = response.css('.card .card-body >h6::text').extract()[0]
        items["job_link"] = response.url
        items["job_salary"] = response.css(".card .card-body .card-list p:first-child::text").extract()[2].replace('  ','')
        items['logo'] = response.css('.card .card-avatar >a::attr(href)').extract()[0]
        items['company'] = response.css('.card .card-body p.card-text>a::text').extract()[0]
        items['job_description'] = ' '.join(response.css('.recruitment-content .recruitment-job .description-content::text').extract()).replace('  ','')
        items['job_requirement'] = ' '.join(response.css('.recruitment-content .recruitment-required-job .description-content::text').extract()).replace('  ','')
        items['job_benefit'] = ' '.join(response.css('.recruitment-content .recruitment-benefit .description-content > p::text').extract()).replace('  ','')
        items['deadline'] = response.css(".card .card-body .card-list p:nth-child(2)::text").extract()[2].replace('  ','')
        items['com_location'] = response.css('.recruitment-content .recruitment-required-profile .description-content .mt-2 > div::text').extract()[0]
        items['com_phone'] = response.css('.recruitment-content .recruitment-required-profile .description-content .mt-2:nth-child(3) > div > a::text').extract()[0]
        yeucaukinhnghiem =   response.css(".recruitment-body .recruitment-info > .row > .col-md-6:first-child").extract()
        items['expRequire']= yeucaukinhnghiem[0][yeucaukinhnghiem[0].rfind("</span>")+7:yeucaukinhnghiem[0].rfind("</div>")]
        hinhthuc = response.css(".recruitment-body .recruitment-info > .row > .col-md-6:nth-child(6)").extract()
        items['workingType']= hinhthuc[0][hinhthuc[0].rfind("</span>")+7:hinhthuc[0].rfind("</div>")]
        items['major'] = response.css(".recruitment-body .recruitment-info > .row > .col-md-6:nth-child(7)> a::text").extract()[0]
        items['province'] = response.css(".recruitment-body .recruitment-info > .row > .col-md-6:nth-child(8)> a::text").extract()[0]
        hocvan = response.css(".recruitment-body .recruitment-info > .row > .col-md-6:nth-child(3)").extract()
        items['educationRequire']= hocvan[0][hocvan[0].rfind("</span>")+7:hocvan[0].rfind("</div>")].replace('  ','')
    
        yield items
    def parse1(self, response):
        # tong so trang ViecLamCanTho
        pages = response.css('.pagination .page-link ::text').extract()
        # tong so bai post trong 1 page
        posts = response.css('.search-item')
        for post in posts:
            # link cua tung post trong 1 page
            links = post.css(' div.search-name > a::attr(href)').extract()
            for url in links:
                # lay du lieu cua bai post do
                yield scrapy.Request(url, callback=self.parse1_attr)
                # sau khi lay het du lieu tung post trong 1 page => crawl next page
                next_page = 'https://vieclamcantho.com.vn/viec-lam-moi-nhat?ts=1&sort2=3&page='+str(PostSpider.pageCrawlOfViecLamCT)
                # gioi han so page crawl <5
                if PostSpider.pageCrawlOfViecLamCT <= 4:
                    # cralw all page ---> PostSpider.pageCrawl <= pages[length-2]:
                    PostSpider.pageCrawlOfViecLamCT += 1
                    yield response.follow(next_page, callback=self.parse1)

# ----------------------

    def parse2(self, response):
        urls = response.css("body .container ul li a.job-link::attr(href)").extract()
        temp = response.css('.pagination li> a::text').extract()
        totalPages = int(temp[len(temp)-3]) 
        for url in urls:
            # crawl all post of 1 page
            yield  scrapy.Request("https://www.careerlink.vn/"+str(url), callback=self.parse2_attr)
            next_page = 'https://www.careerlink.vn/vieclam/list?order=posted_date&sort=desc&page='+str(PostSpider.pageCrawlOfCareerLink)
            if PostSpider.pageCrawlOfCareerLink <= 6:
                # cralw all page ---> PostSpider.pageCrawl <= totalPages:
                PostSpider.pageCrawlOfCareerLink += 1
                yield response.follow(next_page, callback=self.parse2)

    def parse2_attr(self, response):
        items['status']=1
        items['job_link'] = response.url       
        items['job_title'] = response.css(".card .job-detail-header.mt-3 > .media h1::text").extract()[0].replace('\n','')
        items['company'] = response.css(".card .job-detail-header.mt-3 > .media a::attr(title)").extract()[0]
        items['job_salary'] = response.css(".card .job-detail-header.mt-3 > .job-overview> div:nth-child(2) > span.text-primary::text").extract()[0].replace('\n','')
        items['expRequire'] = response.css(".card .job-detail-header.mt-3 > .job-overview> div:nth-child(3) > span::text").extract()[0].replace('\n','')
        items['workingType'] = response.css("#section-job-summary > .row.job-summary > .col-6.pr-1.pl-3 > div > div > div:nth-child(1) > div > .font-weight-bolder::text").extract()[0].replace('\n','')
        items['educationRequire'] = response.css("#section-job-summary > div.row.job-summary.d-flex > div.col-6.pr-1.pl-3.pr-md-2 > div > div > div:nth-child(3) > div > div.font-weight-bolder::text").extract()[0].replace('\n','')     
        items['logo'] = response.css("#jd-col > div > div.card.border-0.font-nunitosans.px-4 > div.job-detail-header.mt-3 > div.media.row.m-0 > div.company-logo.d-flex.align-items-center.justify-content-center.mr-3 > img::attr(src)").extract()[0]
        if('<span>' in response.css("#section-job-description > .my-3 .rich-text-content").extract()[0]):
            items['job_description'] = ' '.join(response.css("#section-job-description > .my-3 p span::text").extract())
        else:
            items['job_description'] = ' '.join(response.css("#section-job-description > .my-3 p::text").extract())
        if('<span>' in response.css("#section-job-skills > .raw-content").extract()[0]):
             items['job_requirement'] = ' '.join(response.css("#section-job-skills > .raw-content > p span::text").extract())
        else:
             items['job_requirement'] = ' '.join(response.css("#section-job-skills > .raw-content > p::text").extract())
        items['job_benefit'] =  ' '.join(response.css("#section-job-benefits > div.my-3 > div > span::text").extract())
       
        items['major'] =' '.join(response.css("#section-job-summary div.job-summary > div div >i.fa-th + div > div.font-weight-bolder > a > span::text").extract())
        items['province'] = response.css(".job-container div.job-detail div.job-overview div > i.cli-map-pin-line + span > a::attr(title)").extract()[0]
# --------- deadline: ngaydang + so ngay het han------------
        ngaydangString = response.css(".job-container div.job-detail div.job-overview > div > div.date-from span::text").extract()
        ngaydang = ngaydangString[2].replace('\n', '') 
# -> format ngaydang: dd-mm-yyyy 
        soNgayHetHanString = response.css(".job-container div.job-detail div.job-overview > div > div.day-expired b::text").extract()
        soNgayHetHan = int(soNgayHetHanString[0][1:3])
        enddate = pd.to_datetime(ngaydang[6:10] + "-" + ngaydang[3:5] + "-" +ngaydang[0:2]) + pd.DateOffset(days=soNgayHetHan)
        deadlineString = str(enddate)[0:10] 
# -> format deadlineString: yyyy-mm-dd
# -> convert yyyy-mm-dd to dd/mm/yyyy
        items['deadline'] =  deadlineString[8:10] + "/" + deadlineString[5:7] + "/" +  deadlineString[0:4] 
        #   locationJob = response.css(".job-container div.job-detail div.job-overview div > i.cli-map-pin-line + span ::text").extract()
        yield items
# def crawl_posts():
#       cmdline.execute("scrapy crawl posts")

# if __name__ == '__main__':
#     crawl_posts()
