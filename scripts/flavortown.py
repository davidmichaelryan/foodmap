import json
import csv
import os

directoryPath = '/Users/davidryan/Programming/personal_projects/foodmap/src/'

def getFormattedAddress(location):
    address = location['address']
    formattedAddress = address['street'] 
    if not isinstance(address['city'], list):
        formattedAddress = formattedAddress + ", " + address['city']
    if not isinstance(address['state'], list):
        formattedAddress = formattedAddress + ", " + address['state']
    if not isinstance(address['postalCode'], list):
        formattedAddress = formattedAddress +  " " + address['postalCode']
    return formattedAddress

def getRawFlavortown():
    with open(directoryPath + 'flavortown_raw.json') as data_file:
        fieriData = json.load(data_file)
    return fieriData    

def addFormattedAddresses():
    fieriData = getRawFlavortown()
    addressList = []

    for location in fieriData:
        parsedLocation = location
        parsedLocation['formattedAddress'] = getFormattedAddress(location)
        addressList.append(parsedLocation)

    print 'running'
    print addressList
    savePath =  '/Users/davidryan/Programming/personal_projects/foodmap/src'

    newFileAndPath = os.path.join(savePath, 'flavortown_with_addresses.json')
    file = open(newFileAndPath, 'w')
    file.write(json.dumps(addressList, sort_keys=True, indent=4))
    file.close()

def printFormattedAddresses():
    with open(directoryPath + 'flavortown_with_addresses.json') as data_file:
        fieriData = json.load(data_file)
    fieriData    

    addressList = []
    keys = {}
    keys["id"] = "id"
    keys["name"] = "name"
    keys["address"] = "address"
    keys["zip_code"] = "zip_code"
    keys["city"] = "city"
    keys["state"] = "state"
    addressList.append(keys);

    count = 1
    for location in fieriData:
        item = {}
        item['id'] = str(count)
        if not isinstance(location['title'], list):
            item['name'] = location['title']
        else:
            item['name'] = ""

        if not isinstance(location['address']['street'], list):
            item['address'] = location['address']['street']
        else:
            item['address'] = ""

        if not isinstance(location['address']['postalCode'], list):
            item['zip_code'] = location['address']['postalCode']
        else:
            item['zip_code'] = ""

        if not isinstance(location['address']['city'], list):
            item['city'] = location['address']['city']
        else:
            item['city'] = ""

        if not isinstance(location['address']['state'], list):
            item['state'] = location['address']['state']
        else:
            item['state'] = ""

        addressList.append(item)
        count = count + 1    
    
    for location in addressList:
        print location['id'] + ', ' + location['name']+ ', ' + location['address']+ ', ' + location['zip_code']+ ', ' + location['city']+ ', ' + location['state']
    return

def convertCSVToJSON():
    fieriData = []

    with open(directoryPath + 'flavortown_lat_lng.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            fieriData.append(row)

    return fieriData

def addLatLng():
    latLngData = convertCSVToJSON()

    with open(directoryPath + 'flavortown_with_addresses.json') as data_file:
        fieriData = json.load(data_file)

    addressList = []

    count = 1
    # lat = 6, lng = 7
    for location in fieriData:
        parsedLocation = location
        parsedLocation['address']['lat'] = latLngData[count][6]
        parsedLocation['address']['lng'] = latLngData[count][7]
        
        addressList.append(parsedLocation)

        count = count + 1

    savePath =  '/Users/davidryan/Programming/personal_projects/foodmap/src'

    newFileAndPath = os.path.join(savePath, 'flavortown_with_lat_lng.json')
    file = open(newFileAndPath, 'w')
    file.write(json.dumps(addressList, sort_keys=True, indent=4))
    file.close()


    
addLatLng()