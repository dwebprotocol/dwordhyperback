const { Client } = require('hyperspace')
const DTree = require('hyperbee')
const { kvPairs : dictionaryPairs } = require('websters-english-dictionary')

start()

async function start() {
    const { corestore, replicate } = new Client()
    const store = corestore()

  // create storage for the dTree we're going to use to store the dictionary
  const core = store.get({ name: 'dictionary' })

   // create dTree
   const db = new DTree(core, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

   // store each definition in the dictionary as key/value pairs using dTree's batch method
   const batch = db.batch()
   for (const { key, value } of dictionaryPairs()) {
     await batch.put(key, value)
   }
 
   await batch.flush()
   
   // Print dTree key
   console.log('The dTree key is:' ,core.key.toString('hex') ,"  -----------------  ", core.discoveryKey.toString('hex'))
 
   // Now announce on dWeb
   await replicate(core)
 }