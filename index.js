const scraperjs = require('scraperjs')
const argv = require('yargs').argv
const R = require('ramda')
const chalk = require('chalk')

const urls = argv._
const scraper = scraperjs.StaticScraper.create
const allP = proms => Promise.all(proms)
const scrape = R.curry((fn, x) => x.scrape(fn))
const then = R.curry((fn, x) => x.then(fn))
const hasGoldTime = str => str.includes('gold-time-big.png')
const toCheck = x => (x ? chalk.green('✔') : chalk.red('✘'))
const toResult = res => `${toCheck(res[1])}\t${res[0]}`

R.compose(
  then(R.tap(R.map(R.compose(console.log, toResult)))),
  then(R.zip(urls)),
  then(R.map(imgs => imgs.some(hasGoldTime))),
  allP,
  R.map(scrape($ => $('#pri-pro img').map((_, img) => $(img).attr('src')).get())),
  R.map(scraper)
)(urls)
