function utils(){
    return {
        fetchAirportList : async function fetchAirportList(url) {
            let response;
            try{
                response = await fetch(url);
            } catch(err) {
                return {type : 'error', message : err};
            }
            if (response.ok) { 
                let json = await response.json();
                json.forEach((item) => {
                    return item['randomKey'] = this.generateRandomKeys(item.code);
                });
                return json;
            } else {
                return {type : 'error', message : response.status};
            }
        }, generateRandomKeys : function(keyword) {
            return `${keyword}_${ new Date().getTime() }`;
        }, getNextPrevRecordOnScroll : function(paginationObject, fullAirportList, scrollType) {
            let startIndex, endIndex;
            switch(scrollType) {
                case 'next':
                    startIndex = paginationObject.startIndexOfPage + paginationObject.recordsPerPage - 50;
                    endIndex = startIndex + paginationObject.recordsPerPage;
                    break;
                case 'prev':
                    endIndex = paginationObject.startIndexOfPage + 50;
                    startIndex = endIndex - paginationObject.recordsPerPage;
                    break;
            }
            paginationObject.startIndexOfPage = startIndex;
            paginationObject.endIndexOfPage = endIndex;
            let paginatedAirportList = fullAirportList.slice(startIndex, endIndex);
            return {paginatedAirportList: paginatedAirportList, paginationObject : paginationObject}
        }
    }
}

function singleton() {
    let instanceOfUtils;
    return {
        getSingletonUtilsObject : function getInstance() {
            if(!instanceOfUtils) {
                instanceOfUtils = new utils();
            }
            return instanceOfUtils;
        }
    }
}

let single = singleton();
export default single.getSingletonUtilsObject();

