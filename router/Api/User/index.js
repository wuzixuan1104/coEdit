/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2020, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const fs = require('fs')
const Path = require('path')
const rootPath = Path.resolve(__dirname, ('..' + Path.sep).repeat(3)) + Path.sep

const viewPath = rootPath + 'src' + Path.sep + 'User' + Path.sep;

module.exports = (request, response) => {
  fs.readFile(viewPath + 'index.html', { encoding: 'utf8' }, (error, data) => {
    if (error) {
      console.log('error', error);

      response.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' })
      response.write("Error：" + error.message)
      response.end()
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' })
      response.write(data)
      response.end()
    }
  })
}
