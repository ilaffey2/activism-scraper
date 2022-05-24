const PORT = 80
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

//Should have better standardization of names for JSON to allow for better of results
//Should break index.js up into smaller applications

const pp_delaware_url = 'https://www.plannedparenthood.org/planned-parenthood-delaware/events'
//Use puppeteer to get this instead of relying on hosting being static?
const womans_march_url = 'https://zen-hypatia-739ed6.netlify.app/feed'

const retihinking_schools_url = 'https://rethinkingschools.org/events/'

app.get('/', function (req, res) {
    res.send(' <body style="background-color:18181a"> \
    <a href="/results0">Planned Parenthood Delaware</a> <br> \
      <a href="/results1">Womens March</a> <br>\
      <a href="/results2">Rethinking Schools</a> <br> \
      </body>')
})

app.get('/results0', (req, res) => {
    const articles = []
    axios(pp_delaware_url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            

            $('.page-content', html).each(function () { //<-- cannot be a function expression
                
                const title = $(this).html()
           //     $('p', title).ea
                const foo = $('.intro', this).html()
                const foo2 = title.replace(foo, "")
                $('p', foo2).each(function () {
                    const text0 = $(this).html().replace(/<br>/g, "         ")
                   // console.log(text0)
                    const text = cheerio.load(text0).text()
                    const title = $('strong', this).text()
                    const info = text.replace(title, "")
                    if (title == ""){
                        return
                    }
                    articles.push({
                        title,
                        info
                    })
                }
                )
            })
            res.json(articles)
 //           console.log(html)
        }).catch(err => console.log(err))
    //    res.json(articles)

})

app.get('/results1', (req, res) => {
    const articles = []
    const config = {
        
    }
    axios(womans_march_url)
        .then(response => {
            const data = response.data
 //           const text = cheerio.load(data).text()        
            const parsed_data = data.events.map(function(e) 
            {
               return { 
                    'title' : e.title,
                    'description' : e.public_description,
                    'city' : e.city,
                    'state' : e.state,
                    'zip' : e.zip,
                    'start' : e.start_datetime
                }
            }
            )

            articles.push(parsed_data)
            

            
 //           articles.push(children)
            res.json(articles)
 //           console.log(data.events)
       //     console.log(typeof json)
        }).catch(err => console.log(err))
    //    res.json(articles)

})


app.get('/results2', (req, res) => {
    const articles = []
    flag = false
    
    axios(retihinking_schools_url)
        .then(response => {
            if (flag){
                return
            }
            const html = response.data
            const $ = cheerio.load(html)
            

            $('script', html).each(function () {
            if (!this.attribs || !this.attribs.type || this.attribs.class == 'yoast-schema-graph' /*<SEO bullshit*/) {
                return
            }
            if (this.attribs.type == 'application/ld+json'){

                const data = this.children
                const json = JSON.parse( $(data).text())

                const parsed_data = json.map(function(e) 
                {
                    flag = true
                    return { 
                            "title" : e.name,
                            "description" : e.description,
                            "url" : e.url,
                            "startDate" : e.startDate
                        }
                    }
                )
                
                articles.push(parsed_data)
                console.log(articles)
                res.json(articles)
            }
            

        //    console.log(this)
            })
        }).catch(err => console.log(err))
        
        
})


app.listen((process.env.PORT || 5000), () => console.log(`server running on PORT ${PORT}`))

