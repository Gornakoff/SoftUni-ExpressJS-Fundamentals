db.getCollection('cars').update({}, { $set: { isRented: false } }, { multi: true })
