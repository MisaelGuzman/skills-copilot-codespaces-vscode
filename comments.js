// create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const template = require('./template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');

// create connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'opentutorials'
});

const app = http.createServer(function(request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            db.query(`SELECT * FROM topic`, function(error, topics) {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = template.list(topics);
                const html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        } else {
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if (error) {
                    throw error;
                });
            }
        });
                db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
                    if (error2) {
                        throw error2;
                    }
                    const title = topic[0].title;
                    const description = topic[0].description;
                    const list = template.list(topics);
                    const html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, function(error, topics) {
            const title = 'Create';
            const list = template.list(topics);
            const html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        }