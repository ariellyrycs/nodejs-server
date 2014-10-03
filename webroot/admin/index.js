
module.exports = function () {
        console.log(this);
        return JSON.stringify([{
                            'students':[
                               {'name':'jorge'},
                               {'name': 'manuel'}
                            ]
                        }]);
         /*return JSON.stringify([{
             'students':[
                {'name':'jorge'},
                {'name': 'manuel'}
             ]
         }]);*/
};