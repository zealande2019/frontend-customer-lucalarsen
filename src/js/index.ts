import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";
import { ICustomer } from "./ICustomer";

const uri:string = "https://customerservicelucalarsen.azurewebsites.net/api/customer/"

let ContentElement: HTMLDivElement = <HTMLDivElement> document.getElementById("content");
let GetAllCustomersbtn : HTMLButtonElement = <HTMLButtonElement> document.getElementById("getAllbtn");
GetAllCustomersbtn.addEventListener("click", ShowAllCustomers);

let GetOneCustomerbtn : HTMLButtonElement = <HTMLButtonElement> document.getElementById("getOnebtn");
GetOneCustomerbtn.addEventListener("click", GetOneCustomer);


let AddCustomerbtn : HTMLButtonElement = <HTMLButtonElement> document.getElementById("addCustomerbtn");
AddCustomerbtn.addEventListener("click", AddCustomer );

let DeleteCustomerbtn : HTMLButtonElement = <HTMLButtonElement> document.getElementById("deleteOnebtn")
DeleteCustomerbtn.addEventListener("click", DeleteCustomer);


function CreateLiElement(tekst:string, classAttribute:string, id:number) : HTMLLIElement{
    let newLiElement = document.createElement("li");
    let NewText = document.createTextNode(tekst);

    newLiElement.setAttribute("class", classAttribute);
    newLiElement.setAttribute("id", id.toString());

    newLiElement.appendChild(NewText);

    return newLiElement;
}


function ShowAllCustomers() :void {
    axios.get<ICustomer[]>(uri)

    .then(function(response:AxiosResponse<ICustomer[]>):void{
        let olElement : HTMLOListElement = document.createElement("ol");

        let x: number = 0;

        response.data.forEach((customer:ICustomer) => {
            x++;
            if (customer == null)
            {
                olElement.appendChild(CreateLiElement("NULL element","error",x));
            }
            else
            {
                let tekst : string = `id(i databasen): ${customer.id} Navn: ${customer.firstname} ${customer.lastname} År: ${customer.year}`
                olElement.appendChild(CreateLiElement(tekst,"r1",customer.id))
            }
        });

        if (ContentElement.firstChild) 
        
            ContentElement.removeChild(ContentElement.firstElementChild);
            ContentElement.appendChild(olElement);
        }
        )
        .catch(function (error:AxiosError):void{
            ContentElement.innerHTML = error.message;
        })
    }

function GetOneCustomer() : void {

    let GetCustomerById : HTMLInputElement = <HTMLInputElement> document.getElementById("inputId");
    let CustomerIdValue : string = GetCustomerById.value;
    let newUri = uri + CustomerIdValue;
    
    axios.get<ICustomer>(newUri)
    .then(function (response:AxiosResponse<ICustomer>):void{

        let olElement : HTMLOListElement = document.createElement("ol");

        let customer : ICustomer = <ICustomer>response.data;

        let x: number = 0;

            x++;
            if (customer == null)
            {
                olElement.appendChild(CreateLiElement("NULL element","error",x));
            }
            else
            {
                let tekst : string = `id(i databasen): ${customer.id} Navn: ${customer.firstname} ${customer.lastname} År: ${customer.year}`
                olElement.appendChild(CreateLiElement(tekst,"r1",customer.id))
            }


        if (ContentElement.firstChild) 
        
            ContentElement.removeChild(ContentElement.firstElementChild);
            ContentElement.appendChild(olElement);
        }
        )

    .catch(function (error:AxiosError):void{
        ContentElement.innerHTML = error.message;
    })

}

function AddCustomer() :void{
    let AddFirstNameElement: HTMLInputElement = <HTMLInputElement> document.getElementById("inputFirstName");
    let AddLastNameElement: HTMLInputElement = <HTMLInputElement> document.getElementById("inputLastName");
    let AddYearElement: HTMLInputElement = <HTMLInputElement> document.getElementById("inputYear");

    let MyFirstName : string = AddFirstNameElement.value;
    let MyLastName : string = AddLastNameElement.value;
    let MyYear : number = +AddYearElement.value;

    axios.post<ICustomer>(uri, {
        firstname: MyFirstName,
        lastname: MyLastName,
        year: MyYear
      })
      .then(function (response : AxiosResponse) : void {
        console.log("Statuskoden er :"+response.status);
      })
      .catch(function (error : AxiosError): void {
        console.log(error);
      });
}

function DeleteCustomer():void{
    let output: HTMLDivElement = <HTMLDivElement> document.getElementById("contentDelete");
    let GetCustomerById : HTMLInputElement = <HTMLInputElement> document.getElementById("inputDelete");
    let CustomerIdValue : string = GetCustomerById.value;
    let newUri = uri + CustomerIdValue;

    axios.delete(newUri)
    .then((response:AxiosResponse)=> {
        // console.log(JSON.stringify(response));
        output.innerHTML = `${response.status} ${response.statusText}`;
    })
    .catch((error:AxiosError)=>{
        output.innerHTML = error.response.statusText;
    })
}