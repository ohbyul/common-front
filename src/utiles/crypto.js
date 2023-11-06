import CryptoJS from 'crypto-js';

const secretKey = 'urban123!@$'

export const encrypt = (val) => {
    let text = val.toString();

    const data = {
        id:text
    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);

    let result = encrypted.toString()
    return encodeURIComponent(result)
} 

export const encryptData = (val) => {
    let text = val.toString();
    const data = {
        id:text
    };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
    let result = encrypted.toString()
    
    return result
} 

export const decrypt = (encrypted) => {
    console.log('복호화전',encrypted);
    if(encrypted){
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('복호화후',decrypted);
        return decrypted.id;
    }
}

export const NAME = "NAME"
export const BIRTH = "BIRTH"
export const MOBILE = "MOBILE"
export const ID = "ID"
export const EMAIL = "EMAIL"
export const ADDRESS = "ADDRESS"


export const onHidePersonalInfo = (type, text) => {
        if(!text){
            return
        }

        if(type === NAME){
            let arr = [...text]
            arr[1] = '*'
            return arr.join('')
        }else 
        if(type === BIRTH){
            let arr = text.split('-')
            arr[1] = '**'
            arr[2] = '**'
            return arr.join('-')
        }else 
        if(type === MOBILE){
            let arr = text.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3').split('-')
            arr[1] = '****'
            return arr.join('-')
        }else 
        if(type === ID){
            let arr = [...text]
            arr.map((item,index) =>{
                if(index > 1){
                    arr[index] = '*'
                }
            })
            return arr.join('')
        }else 
        if(type === EMAIL){
            let arr = text.split('@')
            let id = arr[0]
            let idArr = [...id]
            idArr.map((item,index) =>{
                if(index > 1){
                    idArr[index] = '*'
                }
            })
            arr[0] = idArr.join('')
            return arr.join('@')
        }else 
        if(type === ADDRESS){
            let arr =  text.split(' ')
            arr.map((item,index) =>{
                if(index > 1){
                    arr[index] = '******'
                }
            })
            return arr.join(' ')
        }
    }

