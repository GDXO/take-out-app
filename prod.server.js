const express = require('express')
const port = 8000
const app = express()
const router = express.Router()

router.get('/', (req, res, next) => {
  req.url = '/index.html'
  next()
})

app.use(router)

const appData = require('./data.json')
const sellers = appData.seller
const goods = appData.goods
const ratings = appData.ratings

// api 路由
const apiRoutes = express.Router()

// 分发数据
apiRoutes.get('/sellers', (req, res) => {
  res.json({
    errNo: 0,
    data: sellers
  })
})

apiRoutes.get('/goods', (req, res) => {
  res.json({
    errNo: 0,
    data: goods
  })
})

apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errNo: 0,
    data: ratings
  })
})

// 添加请求开始字段
app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, err => {
  if (err) {
    console.log(err)
    return false
  }

  console.log(`Listening at http://localhost:${port}\n`)
})
