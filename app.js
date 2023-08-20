const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const router=require('./src/routes/paths');
const swaggerJSDoc= require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const options={
  definition:{
    openapi:'3.0.0',
    info:{
      title:"toddle_Journal_Apis",
      version:'1.0.0',
      description:"All apis"
    },
    servers:[
      {
        url:'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  
  apis:['./src/routes/*.js']
}

const swaggerSpec=swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
