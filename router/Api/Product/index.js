/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2020, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = (request, response) => {
  // db
  response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' })
  response.write('Hi, Product!')
  response.end()
}
