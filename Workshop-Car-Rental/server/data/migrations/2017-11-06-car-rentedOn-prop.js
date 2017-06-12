db.getCollection('cars').update({}, { $set: { rentedOn: new Date().toISOString() } }, { multi: true })
