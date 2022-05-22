const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const pp_delaware_url = 'https://www.plannedparenthood.org/planned-parenthood-delaware/events'
//Determine this programatically? ?? How ? ??!
const womans_march_url = 'https://zen-hypatia-739ed6.netlify.app/feed'

app.get('/', function (req, res) {
    res.json('This is my webscraper')
})

app.get('/results', (req, res) => {
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
                    console.log(text0)
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

app.get('/results2', (req, res) => {
    const articles = []
    const config = {
        
    }
    axios('https://zen-hypatia-739ed6.netlify.app/feed')
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



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

