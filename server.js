const port = 5200;
const Path = require('path');
const rootPath = Path.resolve(__dirname, ('..' + Path.sep).repeat(0)) + Path.sep;
const apiPath = rootPath + 'router' + Path.sep;
const fs = require('fs')


const http = require('http').Server();

const sockets = new Map();

let items = [
  { id: 1, title: '嗨～', date: '12:00' },
  { id: 2, title: '今天寫點什麼吧？', date: '12:00' },
  { id: 3, title: '什麼時候有空，約一下', date: '12:00' },
  { id: 4, title: '一起規劃小旅行～', date: '12:00' },
]

http.listen(port, () => {
  console.log('server is running ... http://127.0.0.1:', port);

  SocketIO = require('socket.io').listen(http);

  SocketIO.sockets.on('connection', socket => {
    sockets.set(socket, true);

    socket.on('disconnect', _ => {
      sockets.delete(socket)
      SocketIO.sockets.emit('online', sockets.size)
    })

    socket.on('deleteItem', id => {
      console.log('delete socket', id);

      items = items.filter(item => item.id != id);
      SocketIO.sockets.emit('deleteItem', id);

    });

    socket.on('createItem', title => {
      const date = new Date();
      const newItem = { id: new Date().getTime(), title, date: date.getHours() + ':' + date.getMinutes() };
      items.push(newItem);
      SocketIO.sockets.emit('createItem', newItem);
    })

    socket.on('changeItem', (id, content) => {
      const date = new Date();
      const newDate = date.getHours() + ':' + date.getMinutes();
      const idx = items.map(item => item.id).indexOf(id);
      items[idx] = { id, title: content, date: newDate };

      SocketIO.sockets.emit('changeItem', id, items[idx]);
    });

    SocketIO.sockets.emit('online', sockets.size);

    socket.emit('getItems', items);

    // console.log('socket connecting');

  });
});

http.on('request', (request, response) => {
  const Url = require('url');
  const url = Url.parse(request.url);

  const method = request.method.toUpperCase();
  const pathname = url.pathname.replace(/\/+/gm, '/').replace(/\/$|^\//gm, '');
  Router.mapping(method, pathname, request, response);
});

/** 
 * http://xxxx/Product
 */
const Router = {
  mapping(method, pathname, request, response) {
    const pathUrl = pathname === '' ? 'index' : pathname;
    let dirs = pathUrl.split('/');
    let file = dirs.pop();
    file = file.replace(/index(.html)?/g, '');
    if (file !== '') {
      dirs.push(file.replace(/index(.html)?/g, ''));
    }

    const finalUrl = apiPath + dirs.map(v => v.charAt(0).toUpperCase() + v.slice(1)).join('/');
    const routerType = dirs[0];

    fs.promises.access(finalUrl, fs.constants.R_OK)
      .then(() => {
        RouterType(routerType, finalUrl, request, response);
      })
      .catch(e => {
        require(apiPath + '404')(request, response, e.message);
      });
  }
};

const RouterType = (type, finalUrl, request, response) => {
  switch (type) {
    case 'api':
      delete require.cache[finalUrl];
      require(finalUrl)(request, response);
      break;
    case 'plugin':
      const ex = finalUrl.split('.').pop();
      fs.readFile(finalUrl, { encoding: 'utf8' }, (error, data) => {
        if (error) {
          response.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' })
          response.write("Error：" + error.message)
          response.end()
        } else {
          response.writeHead(200, { 'Content-Type': (ex === 'css' ? 'text/css;' : 'text/html;') + ' charset=UTF-8' })
          response.write(data)
          response.end()
        }
      })
      break;
  }
};