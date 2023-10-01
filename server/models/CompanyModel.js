/*

{
          "name": "company",
          "schema": {
            "id": {"example": "dfjo345393j9dwd9j3", "type": "String", "required": true},
            "name": {"example": "tata", "type": "String",  "required": true},
            "logo": {"example": "iVBORw0KGgoAAAANSUhEUgAAAEAAAABAC","type": "String","desciption":"Base64 encoded url of image"},
            "email": {"example": "hr@example.com","type": "String", "required": true, "unique": true, "desciption": "email of companies hr or who schedule interviews"},
            "password": {"example": "MySecretes@j93","type": "String", "required": true}
          }
        }

*/

import mongoose from "mongoose";

const CompanySchema = mongoose.Schema({
  //   id: {
  //     required: true,
  //     type: String,
  //   },
  HRname: {
    required: true,
    type: String,
  },
  token: {
    required: true,
    type: String,
  },
  companyName: {
    required: true,
    type: String,
  },
  logo: {
    required: false,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  location: {
    // Company branches in their locations
    required: true,
    type: [String],
  },
});

const CompanyData = mongoose.model("CompanyData", CompanySchema);

export default CompanyData;
