#Data Spaces

```js
import SpacesClient from '@q9adam/spaces-client'
let sc = new SpacesClient()
var r = await sc.put('abc','hello')

sc.watch(n=>{
	console.log('data',n)
	},'abc')
```

