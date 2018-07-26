# -*- coding:utf-8 -*-
from flask import Flask, request, render_template, url_for, jsonify, Response, redirect, session
import json, sys
import requests
import os
from OpenSSL import SSL

context = SSL.Context(SSL.SSLv23_METHOD)
context.use_privatekey_file('/app/.key')
context.use_certificate_file('/app/.crt')
app = Flask(__name__, static_url_path='/static')
#bootstrap = Bootstrap(app)

#Autocomplete part......
@app.route('/_autocomplete', methods=['POST'])
def autocomplete():
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "data", "qa.json")
    data = json.load(open(json_url))
    results=[]
    for item in data:
        results.append(item["question"])
    return Response(json.dumps(results), mimetype='application/json')

#get resource json
@app.route('/_getJSON', methods=['POST', 'GET'])
def getJSON():
    if request.method == 'POST':
        question = request.form.get('question')
        print('get input')
        global QUESTION
        QUESTION = question

    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "data", "resource.json")
    resourceJSON = json.load(open(json_url))
    #get the question
    #print("#"*20)
    #print(QUESTION)
    for item in resourceJSON:
        if item["question"]==QUESTION:
            returnedJSON=item

    return Response(json.dumps(returnedJSON), mimetype='application/json')

# index part
# question name
@app.route('/', methods=['GET', 'POST'])
def index():
    #if request.method == 'POST':
     #   question = request.form.get('question')
        #question_type = getTypeofQuestion(question)
        #data = {"type": str(question_type)}
        #return jsonify(data)
    return render_template('index.html')

@app.route('/resource', methods=['GET', 'POST'])
def showResource():

    if request.method == 'GET':
        question=request.args.get('question')
        if question is None:
            question='Who is the president of USA?'
        global QUESTION
        QUESTION=question
        return render_template('resource.html')
    return render_template('resource.html')

@app.route('/list')
def showList():
    if request.method == 'GET':
        question=request.args.get('question')
        if question is None:
            question='List the people who were president of USA.'
        global QUESTION
        QUESTION=question
        return render_template('list.html')
    return render_template('list.html')

@app.route('/literal')
def showLiteral():
    if request.method == 'GET':
        question=request.args.get('question')
        if question is None:
            question='How high is Sagarmatha Mountain?'
        global QUESTION
        QUESTION=question
        return render_template('literal.html')
    return render_template('literal.html')

@app.route('/bol')
def showBoolean():
    if request.method == 'GET':
        question=request.args.get('question')
        if question is None:
            question='Is the Sagarmatha Mountain the highest mountain?'
        global QUESTION
        QUESTION=question
        return render_template('bol.html')
    return render_template('bol.html')

@app.route('/404')
def showNothing():
    return render_template('none.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('none.html')



if __name__ == '__main__':
    app.run(debug = True, host='0.0.0.0', port=8301, ssl_context=context)
