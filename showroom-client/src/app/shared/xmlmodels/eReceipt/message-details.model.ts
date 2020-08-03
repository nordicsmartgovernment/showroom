import {formatDate} from '@angular/common';

export class MessageDetailsModel {
  MessageSenderDetails = new MessageSenderDetails();
  MessageReceiverDetails = new MessageReceiverDetails();
  MessageDetails = new MessageDetails();

  generate(sellerId: number) {
    this.MessageSenderDetails.generate(sellerId);
    this.MessageReceiverDetails.generate();
    this.MessageDetails.generate();
  }
}

class MessageSenderDetails {
  FromIdentifier = 0;
  FromIntermediator = '';

  generate(sellerId: number) {
    this.FromIdentifier = sellerId;
    this.FromIntermediator = 'NONE';
  }
}

class MessageReceiverDetails {
  ToIdentifier = '';
  ToIntermediator = '';

  generate() {
    this.ToIdentifier = 'NSG receipt holder';
    this.ToIntermediator = 'NONE';
  }
}

class MessageDetails {
  MessageIdentifier = '';
  MessageTimeStamp = '';
  ImplementationCode = '';

  generate() {
    this.MessageIdentifier = 'ElectronicReceipt';
    this.MessageTimeStamp = formatDate(new Date(), 'ddMMyyHmmss', 'en-en');
    this.ImplementationCode = 'ECRT';
  }
}
