// update: 2019.11.07
//
//
// upg: virtual connection
// 	c = new connect(id)
//	c.on('message')
//	c.put(data)
//	c.close()

var INSTANCE = 0
var WATCH = 0

const 	SpacesClient = // var sc = new ServiceClient(url)
	module.exports = function(serviceBase){
	INSTANCE++
	var instance = INSTANCE
	
	//const {serviceBase} = require('../api.js')
	//const fetch = require('node-fetch') // for debugging directly.

	this.about = n=>new Promise(async (res,rej)=>{
		//returns the current since
	
		var _xid = encodeURIComponent(n)
		var u = `${serviceBase}/about/${_xid}` // since,series,stats
		var r = await fetch(u)
		if(r.ok){
			r = await r.json()
			}
		else
			r = false

		res(r) // {since,series,stats}
		})

	this.put = (n,m)=>new Promise(async (res,rej)=>{
		var _xid = encodeURIComponent(n)
		var _b = encodeURIComponent(m)
		var u = `${serviceBase}/put/${_xid}/?body=${_b}` // upg: json body post
		var r = await fetch(u)
		if(r.ok){
			r = await r.json()
			}
		else
			r = false

		res(r)
		})

	this.get = (n,s)=>new Promise(async (res,rej)=>{
		var _xid = encodeURIComponent(n)
		var _s = encodeURIComponent(s)
		var u = `${serviceBase}/get/${_xid}/${_s}` /// upg: option to fail (not wait) if not found.
		var r = await fetch(u)
		if(r.ok){
			r = await r.json()
			}
		else
			r = false

		res(r)
		})
	
	//upg: unwatch...

	this.watch = (cb,n,since)=>{ // upg:option to return promise of since (so can wait to be sure listening)
		WATCH++

		var watchinstance = WATCH
		var series = false

		//console.log('watch init',{watchinstance,instance,cb,n,since})

		const next = async (n,since)=>{

			var _xid = encodeURIComponent(n)

			var u = `${serviceBase}/get/${_xid}` // upg: json body post


			if(typeof(since) != 'undefined'){
				var _since = encodeURIComponent(since)
				u+= '/'+_since
				}
			
			try{
				var r = await fetch(u)
				if(r.ok){
					r = await r.json()
					//console.log(watchinstance,instance,'instance',r,r.list)
					//upg: test timeout support
					if(r.list)
						cb(r.list)

					let since = undefined
					if(series === false || r.series == series)
						since = r.since

					series = r.series  //upg: test series lgoic


					next(n,since)
					}
				else
					r = false // upg: add this too to retry code (which falls back to waiting with each unsuccessful retry)

				//upg: error support / recovery
				}
			catch(e){
				console.log('await error -- server timed out?',e) // upg: backoff retries if failing in a row..
				setTimeout(nn=>next(n,since),1500) // temp fix.
				}

			}

		next(n,since)
		

		return cb
		}//func
	
	}


/////////////////
/*
;(async function(){
var c = ServiceClient

var r = await c.put('abc','hello')

c.watch(n=>{
	console.log('data',n)
	},'abc')

console.log('rr',r)
})();
*/
