# arte-de-caderno-back
Backend application for 'Arte de Caderno' website

## How to run locally
 1. Clone the repository - `git clone`
 2. Install nodejs v19.3.0
 3. Install the packages - `npm install`
 4. Add a file to the root of the project called _.env_
 5. As the example below, add the infos in _.env_ file. The MONGO_URI is the url to MongoDB Atlas Database, and you can define a port. If a port is not defined, the server will run on port 3000. Replace the user and password in Mongo URI.
 ```
    MONGO_URI="mongodb+srv://</user>:<password></password>@cluster0.5czq7bw.mongodb.net/test"
    PORT=8080
 ```
 6. Run using `npm start`

<hr>

### Summary

#### [Objects](#Objects)
#### [Routes](#Routes)
#### [Professor](#Professor)
#### [Student](#Student)
#### [School](#School)
#### [Draws](#Draws)
#### [Evaluator](#Evaluator)
#### [Notice](#Notice)
#### [PublicDraws](#PublicDraws)
<hr>

### <a id="Objects">Objects</a>

**Object School**:

The "School" object represents a school

Parameter | Type
---|---
name| string
code| string
uf| string
city| string
address| string
cep| string
phone| string
id?| string
email?| string
site?| string

**Object Student**:

The "Student" object represents a student in an educational system

Parameter | Type
---|---
email| string
name| string
cpf| string
uf| string
city| string
address| string
cep| string
phone| string
date_of_birth| Date
schoolId| Types.ObjectId
drawsId| Types.ObjectId[]
id?| string | undefined
loginId?| Types.ObjectId

**Object Draws**:

The "Draws" object represents drawings or artworks

Parameter | Type
---|---
title| string
linkImage| string
category| string
review| date?: Date ;  evaluator?: Types.ObjectId; score?: number; note: string;
author| Types.ObjectId 
notice| Types.ObjectId

**Object Professor**:

The "Professor" object represents a teacher or professor in an educational system

Parameter | Type
---|---
name | string
email| string
cpf| string
uf| string
city| string
address| string
cep| string
phone| string
date_of_birth| Date
schoolId| Types.ObjectId[]
studentsId| Types.ObjectId[]
id?| string
loginId?| Types.ObjectId

**Object Evaluator**:

The "Evaluator" object represents an evaluator or reviewer

Parameter | Type
---|---
name| string
email| string
cpf| string
draws| Types.ObjectId[]
id?| string
loginId?| Types.ObjectId

**Object Notice**
The "Notice" object represents the start and end date of event registrations

Parameter | Type
id?| string
start_date| string
final_date| string
notice_file| string
draws| Types.ObjectId


**Object publicDraws**
The "publicDraws" object represents drawings that have undergone filtering and can be displayed in public

Parameter | Type
id?| string
draws| Types.ObjectId


<hr>

## <a id="Routes">Routes</ai>

### <a id="Professor">Professor Routes</a>

#### <li>List Professor (`/professor`)

**Method** : GET

**Request** : -

**Response**:

Status | Return
--- | ---
200 | Type: Object Name: Professor
500 | Message: Internal Server Error

#### <li>Get Professor By Id (`/professor/:id`)

**Method** : GET

**Request** : 
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Professor
400 | Message: invalid datas
404 | Message: Professor Not Found
500 | Message: Internal Server Error

#### <li>Get Schools by professor (`/professor/school/:id`)

**Method** : GET

**Request** : 
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: School
400 | Message: invalid datas
404 | Message: Professor Not Found
500 | Message: Internal Server Error


#### <li>Get students by professor (`/professor/student/:id`)

**Method** : GET

**Request** : 
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Student
400 | Message: invalid datas
404 | Message: Professor Not Found
500 | Message: Internal Server Error

#### <li>Insert Professor (`/insertProfessor`)

**Method** : POST

**Request** :

Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | false
email| string | true | false
cpf| string | true | true
uf| string | true | false
city| string | true| false
address| string | true| false
cep| string | true| false
phone| string | true| false
date_of_birth| Date | true| false
schoolId| Types.ObjectId[] | true| false
password| string | true| false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Professor
400 | Message: invalid datas
400 | Message: message from mongoose
500 | Message: Internal Server Error
  
#### <li>Update Professor (`/professor/update/:id`)

**Method** : POST

**Request** :

Params: id

Body:
Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | false
email| string | true | false
uf| string | true | false
city| string | true| false
address| string | true| false
cep| string | true| false
phone| string | true| false
date_of_birth| Date | true| false
schoolId| Types.ObjectId[] | true| false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Professor
400 | Message: invalid datas
400 | Message: message from mongoose
500 | Message: Internal Server Error

#### <li>Insert Student By Professor Id (`/professor/student/:id`)
**Method** : POST

**Request** :
Params: id

Body:
Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | false | false
email| string | false | false
cpf| string | false | true
uf| string | false | false
city| string | false| false
address| string | false| false
cep| string | false| false
phone| string | false| false
date_of_birth| Date | false| false
schoolId| Types.ObjectId[] | false| false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Student
400 | Message: invalid datas
400 | Message: message from mongoose
404 | Professor not found
500 | Message: Internal Server Error


#### <li>Delete Professor (`/professor/:id`)
**Method** : DELETE

**Request** :
Params: id

**Response**:

Status | Return
--- | ---
200 | Message: Professor deleted
404 | Message: Professor not found
500 | Message: Internal Server Error

#### <li>Add School By Professor Id (`/professor/addSchool/:id`)

**Method** : POST

**Request**:

Params: id

Body:
Parameter | Type | Required
---|--- | ---
schoolId | Types.ObjectId | true

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Professor
400 | Message: Id is required
400 | Message: School id is required
500 | Message: Internal Server Error

<hr>

### <a id="Student">Student Routes</a>

#### <li>List Student (`/student`)

**Method** : GET

**Request** : -

**Response**:

Status | Return
--- | ---
200 | Type: Object Name: Student
500 | Message: Internal Server Error

#### <li>Get Student By Id (`/student/:id`)

**Method** : GET

**Request** :
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Student
400 | Message: invalid datas
404 | Message: Student Not Found
500 | Message: Internal Server Error

#### <li>Get Draws By Student Id (`/student/:id/draws`)

**Method** : GET

**Request** : 
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Draws
400 | Message: invalid datas
404 | Message: Student Not Found
500 | Message: Internal Server Error

#### <li>Insert Student (`/insertStudent`)

**Method** : POST

**Request** :

Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | false
email| string | true | false
cpf| string | true | true
uf| string | true | false
city| string | true| false
address| string | true| false
cep| string | true| false
phone| string | true| false
date_of_birth| Date | true| false
schoolId| Types.ObjectId[] | true| false
password| string | true| false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Student
400 | Message: invalid datas
400 | Message: message from mongoose
500 | Message: Internal Server Error
  
#### <li>Update Student (`/student/update/:id`)

**Method** : POST

**Request** :

Params: id

Body:
Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | false
cpf| string | true | true
uf| string | true | false
city| string | true| false
address| string | true| false
cep| string | true| false
phone| string | true| false
date_of_birth| Date | true| false
schoolId| Types.ObjectId[] | true| false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Student
400 | Message: invalid datas
400 | Message: message from mongoose
404 | Message: Student not found
500 | Message: Internal Server Error

#### <li>Delete Student (`/student/:id`)
**Method**: DELETE

**Request**:
Params: id

**Response**:

Status | Return
--- | ---
200 | Message: Student deleted
404 | Message: Student not found
500 | Message: Internal Server Error

<hr>

### <a id="School">School Routes</a>

#### <li> List Schools (`/school`)

**Method**: GET

**Request**: -

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: School
500 | Message: Internal Server Error

#### <li> Get School By Id (`/school/:id`)

**Method**: GET

**Request**:
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: School
404 | Message: School Not Found
500 | Message: Internal Server Error

#### <li> Insert School (`/insertSchool`)

**Method**: POST

**Request**:

Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | true
code | string | true | true
uf | string | true | false
city | string | true | false
address | string | true | false
cep | string | true | false
phone | string | true | false
email | string | false | false
site | string | false | false

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: School
400 | Message: All fields are required
500 | Message: Internal Server Error

#### <li> List Schools By City (`/school/city`)

**Method**: POST

**Request**:

Parameter | Type | Required
---|--- | ---
city | string | true

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: School
400 | Message: City is required
500 | Message: Internal Server Error

#### <li> List Ufs (`/school/ufs`)

**Method**: GET

**Request**: -

**Response**:

Status | Return
--- | ---
200 | Type: Array of Strings; Name: Uf
500 | Message: Internal Server Error

#### <li> List Cities By Uf (`/school/cities`)

**Method**: POST

**Request**:

Parameter | Type | Required
---|--- | ---
uf | string | true

**Response**:

Status | Return
--- | ---
200 | Type: Array of Strings; Name: City
400 | Message: Uf is required
400 | Message: Uf must have 2 characters
500 | Message: Internal Server Error

<hr>

### <a id="Draws">Draws Routes</a>

#### <li>List All Draws (`/draw/all`)

**Method**: GET

**Request**: -

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Draw
500 | Message: Internal Server Error

#### <li>Get Draw By Id (`/draw/:id`)

**Method**: GET

**Request**:
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Draw
500 | Message: Internal Server Error

#### <li>Get Draw By Student (`/draw/student/:id`)

**Method**: GET

**Request**:
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Draw
500 | Message: Internal Server Error

#### <li>List Desclassified Draws (`/draw/allDesclassified`)

**Method**: GET

**Request**: -

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Draw
500 | Message: Internal Server Error

#### <li>Insert Draw By Category (`/draw/category`)

**Method**: POST

**Request**:

Parameter | Type | Required
---|--- | ---
category | string | true

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Draw
400 | Message: Category is required
500 | Message: Internal Server Error

#### <li>Insert Draw (`/draw`)

**Method**: POST

**Request**:

Parameter | Type | Required
---|--- | ---
title | string | true
linkImage | string | true
category | string | true
review | object | true
review.date | Date | false
review.evaluator | Types.ObjectId | false
review.score | number | false
review.note | string | true

**Response**:

Status | Return
--- | ---
201 | Type: Object; Name: Draw
400 | Message: All fields are required
500 | Message: Internal Server Error

#### <li>Insert Score For Draw (`/draw/score/:id`)

**Method**: POST

**Request**:

Params: id

Parameter | Type | Required
---|--- | ---
score | number | true

**Response**:

Status | Return
--- | ---
201 | Type: Object; Name: Draw
400 | Message: Score is required
400 | Message: Score must be between 0 and 100
500 | Message: Internal Server Error

#### <li>Desclassified Draw (`/draw/desclassified/:id`)

**Method**: POST

**Request**:

Params: id

Parameter | Type | Required
---|--- | ---
note | string | true

**Response**:

Status | Return
--- | ---
201 | Type: Object; Name: Draw
500 | Message: Internal Server Error

<hr>

### <a id="Evaluator">Evaluator Routes</a>

#### <li>List Evaluators (`/evaluator`)

**Method** : GET

**Request** : 
Params: id

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Evaluator
500 | Message: Internal Server Error

#### <li>Get Evaluator By Id (`/evaluator/:id`)

**Method** : GET

**Request** : 
Params: id (Evaluator ID)

**Response**:

Status | Return
--- | ---
200 | Type: Object; Name: Evaluator
400 | Message: Invalid Evaluator ID
404 | Message: Evaluator Not Found
500 | Message: Internal Server Error

#### <li>Insert Evaluator (`/insertEvaluator`)

**Method** : POST

**Request** :

Body:
Parameter | Type | Required | Unique
---|--- | --- | ---
name | string | true | false
email| string | true | false
cpf| string | true | true
password| string | true | false

**Response**:

Status | Return
--- | ---
201 | Type: Object; Name: Evaluator
400 | Message: User already exists
500 | Message: Internal Server Error

#### <li>Get Draws By Evaluator (`/evaluator/:id/draws`)

**Method** : GET

**Request** : 
Params: id (Evaluator ID)

**Response**:

Status | Return
--- | ---
200 | Type: Array of Objects; Name: Draw
404 | Message: Evaluator Not Found
500 | Message: Internal Server Error

<hr>
