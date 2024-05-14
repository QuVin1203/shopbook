//api để tìm kiếm bằng ký tự keyword
class APIFilters {
    constructor(query,queryStr){
        this.query=query
        this.queryStr=queryStr
    }
    search(){
        const keyword=this.queryStr.keyword //nếu có đối tượng queryStr dc truyen vào thì luu vào keyword
        ?{                                  //nếu keyword tồn tại thì 1 object sẽ dc tao ra
            name:{
                $regex:this.queryStr.keyword,//tìm kiếm từ khóa
               //$regex: '.*' + this.escapeRegex(this.queryStr.keyword) + '.*', // Tìm kiếm từ khóa với dấu cách và không phân biệt hoa thường
                $options:'i'                 //k phân biệt hoa thường
            },
        }
        :{}
        this.query=this.query.find({...keyword})
        return this
    }
    //escapeRegex(text) {
        //return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
   // }
    filters(){
        const queryCopy={...this.queryStr}

        //fields to remove
        const fieldsToRemove=['keyword','page']
        fieldsToRemove.forEach((el)=>delete queryCopy[el])

        //advance filter : frice,ratings
        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match)=> `$${match}`)
        this.query=this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resPerPage){
        const currentPage=Number(this.queryStr.page) || 1
        const skip=resPerPage*(currentPage-1)
        this.query=this.query.limit(resPerPage).skip(skip)
        return this
    }
}
export default APIFilters