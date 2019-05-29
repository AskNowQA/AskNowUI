# -*- coding:utf-8 -*-
from flask import Flask, request, render_template, url_for, jsonify, Response, redirect, session
import json, sys
import requests
from gevent.pywsgi import WSGIServer
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


def processKariResult(kariResult, question):
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
    s = Set()
    print kariResult
    if not kariResult:
        return {'question': question, 'question_type': "none"}
    for item in kariResult['answers']:
        s.add(item)
    if len(s) == 0:
        return resultListDict
    elif len(s) == 1:
        if  'http' not in kariResult['answers'][0]:
            returnType = 'literal'
            resultLiteralDict["answer"] =  kariResult['answers'][0]
            return resultLiteralDict
        else:
            returnType = 'resource'
            for item in kariResult['answers']:
                if not item:
                    continue
                else:
                    uri = item
                    q = """select ?label ?abstract where { <%s> rdfs:label ?label . <%s> <http://dbpedia.org/ontology/abstract> ?abstract . }"""%(uri,uri)
                    url = "http://dbpedia.org/sparql"
                    p = {'query': q}
                    h = {'Accept': 'application/json'}
                    proxydict = {"http":"http://webproxy.iai.uni-bonn.de:3128"}
                    try:
                        r = requests.get(url, params=p, headers=h, proxies=proxydict)
                        # r = requests.get(url, params=p, headers=h)
                        d =json.loads(r.text)
                    except Exception,e:
                        print e
                    try:
                        for row in d['results']['bindings']:
                            if 'abstract' in row and 'label' in row:
                                if row['abstract']['xml:lang'] == 'en' and row['label']['xml:lang'] == 'en':
                                    #print row,count
                                    resultResourceDict['answer'] = row['label']['value']
                                    resultResourceDict['abstract'] = row['abstract']['value' ]
                    except Exception,e:
                        print e
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
                        # r = requests.get(url, params=p, headers=h)
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
        if  'http' not in kariResult['answers'][0]:
            returnType = 'literal'
            resultLiteralDict["answer"] =  kariResult['answers']
            return resultLiteralDict
        else:
            returnType = 'list'
            count = 0
            for item in kariResult['answers']:
                uri = item
                q = """select ?label ?abstract where { <%s> rdfs:label ?label . <%s> <http://dbpedia.org/ontology/abstract> ?abstract . }"""%(uri,uri)
                url = "http://dbpedia.org/sparql"
                p = {'query': q}
                h = {'Accept': 'application/json'}
                proxydict = {"http":"http://webproxy.iai.uni-bonn.de:3128"}
                try:
                    r = requests.get(url, params=p, headers=h, proxies=proxydict)
                    # r = requests.get(url, params=p, headers=h)
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
    

#get resource json
@app.route('/_getJSON', methods=['POST'])
def getJSON():
    question = None
    if request.method == 'POST':
        question = request.form.get('question')
    #res = es.index(index="autocompleteindex1", doc_type='questions', id=QUESTION,  body={"question":{"input":[QUESTION]}}) #Store input questions for autocomplete
        headers = {'Accept': 'text/plain', 'Content-type': 'application/json'}
        earlanswer = requests.post('http://localhost:4444/processQuery',data=json.dumps({'nlquery':question}),headers=headers)
        earlresultdict = json.loads(earlanswer.content)
        entities = []
        relations =[]
        if earlresultdict:
            for k,v in earlresultdict['rerankedlists'].iteritems():
                if len(v)>0:
                    if '/resource/' in v[0][1]:
                        entities.append(v[0][1])
                    if '/ontology/' in v[0][1] or '/property/' in v[0][1]:
                        relations.append(v[0][1])
        try:
            headers = {'Accept': 'text/plain', 'Content-type': 'application/json'}
            karianswer = requests.get('http://localhost:1999/graph',data={'question':question},headers=headers)
            kariresultdict = json.loads(karianswer.content)
            resourceDict = processKariResult(kariresultdict, question)
            resourceDict['fullDetail'] = kariresultdict
            resourceDict['entities'] = entities
            resourceDict['relations'] = relations
            return Response(json.dumps(resourceDict), mimetype='application/json')   
        except Exception,e:
            print e
            return Response(json.dumps({'question': question, 'entities':entities, 'relations':relations, 'question_type': "none"}), mimetype='application/json')


# index part
# question name
@app.route('/', methods=['GET', 'POST'])
def index():  
    return render_template('index.html')



@app.route('/answer')
def showAnswer():
    if request.method == 'GET':
        question=request.args.get('question')
        return render_template('answer.html') 
    return render_template('answer.html')

@app.route('/404')
def showNothing():
    return render_template('answer.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('answer.html')



if __name__ == '__main__':
    http_server = WSGIServer(('', int(sys.argv[1])), app)
    http_server.serve_forever()
