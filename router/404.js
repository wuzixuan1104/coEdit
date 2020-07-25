/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2020, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = (request, response, error) => {
  // db
  response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' })
  response.write('404 Not found! ' + error)
  response.end()
}
