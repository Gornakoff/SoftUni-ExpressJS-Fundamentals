db.getCollection('cars').update({}, { $set: { createdOn: Date.noe() } }, { multi: true })
