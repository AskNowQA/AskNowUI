# -*- coding:utf-8 -*-
from flask import Flask, request, render_template, url_for, jsonify, Response, redirect, session
import json, sys
import requests
import os
from sets import Set
from elasticsearch import Elasticsearch


app = Flask(__name__, static_url_path='/static')
#bootstrap = Bootstrap(app)
es = Elasticsearch()

#Autocomplete part...... 
#@app.route('/_autocomplete', methods=['GET'])
#def autocomplete():
#    search = request.args.get('term')
#    res = es.search(index='autocompleteindex1', doc_type='questions', body={"suggest": {"question-suggest": {"prefix": search,"completion": {"field": "question"}}}})
#    results = []
#    #print json.dumps(res)
#    for entry in res['suggest']['question-suggest']:
#        for q in entry['options']:
#            results.append(q['_source']['question']['input'][0])
#    return Response(json.dumps(results), mimetype='application/json')


def processEarlResult(earlResult, question):
    resultResourceDict = {
      "question": question,
      "answer": "No result found",
      "entity": "No result found",
      "earltop": "",
      "sqg": "",
      "type": "No result found",
      "abstract": "No result found",
      "summary":"No result found",
      "recommendations":"No result found",
      "related_entities":"No result found",
      "similar_entities":"No result found",
      "question_type":"resource"
    }
    resultListDict =  {
      "question": question,
      "answer": { "0": "No result found"
      },
      "abstract":{ "0": "No result found"
      },
      "question_type":"list",
      "earltop":"",
      "sqg":""
       
    }
    resultBolDict = {
      "question": question,
      "answer": "No result found",
      "question_type":"bol",
      "earltop": "",
      "sqg": ""
    }
    resultLiteralDict = {
      "question": question,
      "answer": "No result found",
      "question_type":"literal",
      "earltop": "",
      "sqg":""
    }
    
    returnType = 'list'#default
    s = Set()
    if not earlResult:
        return resultResourceDict
    for item in earlResult[0]:
        if not item:
            continue
        d = item['u_0']
        if d['type'] == 'uri':
            s.add(d['value'])
    if len(s) == 0:
        return resultListDict
    elif len(s) == 1:
        returnType = 'resource'
        for item in earlResult[0]:
            if not item:
                continue
            d1 = item['u_0']
            if d1['type'] == 'uri':
                uri = d1['value']
                q = """select ?label ?abstract where { <%s> rdfs:label ?label . <%s> <http://dbpedia.org/ontology/abstract> ?abstract . }"""%(uri,uri)
                url = "http://dbpedia.org/sparql"
                p = {'query': q}
                h = {'Accept': 'application/json'}
                proxydict = {"http":"http://webproxy.iai.uni-bonn.de:3128"}
                try:
                    r = requests.get(url, params=p, headers=h, proxies=proxydict)
                    d =json.loads(r.text)
                except Exception,e:
                    print e
                try:
                    for row in d['results']['bindings']:
                        if 'abstract' in row and 'label' in row:
                            if row['abstract']['xml:lang'] == 'en' and row['label']['xml:lang'] == 'en':
                                #print row,count
                                resultResourceDict['answer'] = row['label']['value']
                                resultResourceDict['abstract'] = row['abstract']['value']
                except Exception,e:
                    print e
                uri = d1['value']
                print uri
                q = """select distinct ?entityType ?label where {
                        <%s> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?entityType . 
                        ?entityType rdfs:label ?label  
                        FILTER regex(?entityType, "http://dbpedia.org/ontology/") 
                        FILTER langMatches( lang(?label), "EN") }"""%(uri)
                url = "http://dbpedia.org/sparql"
                p = {'query': q}
                h = {'Accept': 'application/json'}
                proxydict = {"http":"http://webproxy.iai.uni-bonn.de:3128"}
                try:
                    r = requests.get(url, params=p, headers=h, proxies=proxydict)
                    d =json.loads(r.text)
                except Exception,e:
                    print e
                try:
                    typeString = []
                    for row in d['results']['bindings']:
                        typeString.append(row['label']['value'])
                    resultResourceDict['type'] = '/'.join(typeString)
                except Exception,e:
                    print e
        return resultResourceDict
    elif len(s) > 1:
        returnType = 'list'
        count = 0
        for item in earlResult[0]:
            d1 = item['u_0']
            if d1['type'] == 'uri':
                uri = d1['value']
                q = """select ?label ?abstract where { <%s> rdfs:label ?label . <%s> <http://dbpedia.org/ontology/abstract> ?abstract . }"""%(uri,uri)
                url = "http://dbpedia.org/sparql"
                p = {'query': q}
                h = {'Accept': 'application/json'}
                proxydict = {"http":"http://webproxy.iai.uni-bonn.de:3128"}
                try:
                    r = requests.get(url, params=p, headers=h, proxies=proxydict)
                    d =json.loads(r.text)
                except Exception,e:
                    print e
                try:
                    for row in d['results']['bindings']:
                        if 'abstract' in row and 'label' in row:
                            if row['abstract']['xml:lang'] == 'en' and row['label']['xml:lang'] == 'en':
                                #print row,count
                                resultListDict['answer'][str(count)] = row['label']['value']
                                resultListDict['abstract'][str(count)] = row['abstract']['value']
                                count += 1
                except Exception,e:
                    print e 
        return resultListDict
    return resultListDict
    

#get resource json
@app.route('/_getJSON', methods=['POST', 'GET'])
def getJSON():
    if request.method == 'POST':
        question = request.form.get('question')
        global QUESTION
        QUESTION = question
    print(QUESTION)
    #res = es.index(index="autocompleteindex1", doc_type='questions', id=QUESTION,  body={"question":{"input":[QUESTION]}}) #Store input questions for autocomplete
    inputDict = {'nlquery':QUESTION, 'pagerankflag': True}
    #r = requests.post("http://sda.tech/earl/api/answer", data=json.dumps(inputDict), headers={"content-type": "application/json"})
    r = requests.post("https://asknowdemo.sda.tech/earl/api/answerdetail", data=json.dumps(inputDict), headers={"content-type": "application/json"})
    earlResult = json.loads(r.text)
    resourceDict = processEarlResult(earlResult['answers'], QUESTION)
    resourceDict['fullDetail'] = earlResult
    return Response(json.dumps(resourceDict), mimetype='application/json')   


# index part
# question name
@app.route('/', methods=['GET', 'POST'])
def index():  
    return render_template('index.html')



@app.route('/resource', methods=['GET', 'POST'])
def showResource(): 
    if request.method == 'GET':
        question=request.args.get('question')
        global QUESTION
        QUESTION=question
        return render_template('resource.html') 
    return render_template('resource.html')


@app.route('/list')
def showList():
    if request.method == 'GET':
        question=request.args.get('question')
        global QUESTION
        QUESTION=question
        return render_template('list.html') 
    return render_template('list.html')

@app.route('/literal')
def showLiteral():
    if request.method == 'GET':
        question=request.args.get('question')
        global QUESTION
        QUESTION=question
        return render_template('literal.html') 
    return render_template('literal.html')

@app.route('/bol')
def showBoolean():
    if request.method == 'GET':
        question=request.args.get('question')
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
    app.run(debug = True, threaded=True, port=int(sys.argv[1]))

