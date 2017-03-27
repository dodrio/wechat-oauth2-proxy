/**
 * module dependencies
 */

const url = require('url')
const path = require('path')
const throng = require('throng')
const Koa = require('koa')
const koaBunyanLogger = require('koa-bunyan-logger')
const koaStatic = require('koa-static')
const config = require('./config')

const meta = require('./package.json')

const app = new Koa()

/**
 * trust proxy related header or not
 */

app.proxy = config.proxy

/**
 * normal logger
 */

const bunyan = koaBunyanLogger.bunyan
const logger = bunyan.createLogger({
  name: meta.name
})

/**
 * request logger
 */

app.use(koaBunyanLogger({
  name: meta.name
}))
app.use(koaBunyanLogger.requestIdContext())
app.use(koaBunyanLogger.requestLogger())

/**
 * static file serving
 */

const staticRoot = path.join(__dirname, 'public')
app.use(koaStatic(staticRoot))

/**
 * oauth2 proxy
 */

app.use((ctx, next) => {
  const { redirect } = ctx.query

  if (!redirect) {
    ctx.body = {
      message: `Hello from ${meta.name}.`
    }

    return
  }

  delete ctx.query.redirect
  const query = ctx.query

  const redirectURI = composeRedirectURI(redirect, query)
  ctx.redirect(redirectURI)
})

throng(listen)

function listen () {
  const { host, port } = config.listen
  app.listen(port, () => {
    const baseMsg = `listening on ${host}:${port}`
    let msg
    if (app.proxy) {
      msg = `${baseMsg} in proxy mode`
    } else {
      msg = `${baseMsg}`
    }

    logger.info(msg)
  })
}

function composeRedirectURI (redirect, query) {
  const redirectURI = decodeURIComponent(redirect)

  /**
   * when urObject.search is undefined, `url.format()` will generate
   * search string from urlObject.query.
   */
  const urlObject = url.parse(redirectURI, true)
  delete urlObject.search
  Object.assign(urlObject.query, query)

  const uri = url.format(urlObject)
  return uri
}
