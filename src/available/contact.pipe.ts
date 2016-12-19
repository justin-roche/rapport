import { Pipe, PipeTransform } from '@angular/core';
import { gmailContact } from '../shared/custom-type-classes';

@Pipe({name: 'filterContacts'})
export class FilterContacts implements PipeTransform {

  transform(contacts: any, searchText: string) {
    if(!searchText) {
      return contacts;
    } else if (contacts) {
      searchText = searchText.toLowerCase();

      if(contacts[0].fullName) {
         return contacts.filter(contact => {
          if(contact.fullName.toLowerCase().indexOf(searchText) !== -1 || contact.vanity.toLowerCase().indexOf(searchText) !== -1) {
            return true
          }
        });

      } else {
        return contacts.filter(contact => {
          //|| contact.email.toLowerCase().indexOf(searchText) !== -1
          if(contact.name.toLowerCase().indexOf(searchText) !== -1) {
            return true
          }
        });
      }
      

    }
  }

}