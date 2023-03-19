# HR-LINE-BOT
    เอกสารนี้เป็น README สำหรับโปรเจ็ค [HR-LINE-BOT] 
    
    เนื่องจากการลงเวลางานใน Googleform พบปัญหาหน่วงและล่าช้ารวมถึง UX/UI การใช้งานที่มีบางขั้นตอน User ได้รับประสบการณ์ที่ไม่ดีและโครงสร้างข้อมูลที่เก็บอยู่บน spreadsheet บางส่วนอาจไม่สอดคล้องต่อความต้องการในอนาคตรวมถึงการขยับขยายระบบ

    *** โปรเจ็คนี้เป็นโปรเจ็คอาสาสมัคร ทำมาเพื่อแก้ปัญหาการลงเวลาให้มีความสะดวกสบายมากยิ่งขึ้นและลดจำนวนการทำงานโดยมนุษย์ให้น้อยลง ***

## วัตถุประสงค์
    1. เพื่อปรับปรุงโครงสร้างข้อมูลการเก็บข้อมูลการลงเวลางาน (ย้ายฐานข้อมูลหลักจาก googlesheet ไป RDBMS  )
    2. เพื่อนำทรัพยากรที่มีอยู่แล้วในบริษัทมาใช้ให้เกิดประโยชน์สูงสุด (Server & Hosting)
    3. ต้องการลดงานของพนักงานที่ต้องรับผิดชอบ ลดความผิดพลาดและมีเวลาใส่ใจคุณภาพงานอื่น ๆ 
  
    
     
## ประโยชน์
    1. ใช้สำหรับลงเวลาเข้าออกการทำงาน (ในอนาคตจะเพิ่ม Leave Confirmation ระบบแจ้งการลาของพนักงานและให้หัวหน้าสามารถตอบอนุมัติได้ทันที)
    2. แอพลิเคชันมีการตอบสนองที่รวดเร็วผู้ใช้ลงเวลางานได้สะดวกยิ่งขึ้น
    3. ข้อมูลที่อยู่บน RDBMS สามารถนำมาหา Insight อื่น ๆ เพื่อศึกษาพฤติกรรมพนักงานให้เข้าใจพนักงานมากยิ่งขึ้น
    4. ลดการทำงาน เพิ่มความถูกต้องของข้อมูล
     

## เริ่มต้น

### สิ่งที่ต้องมีก่อนเริ่มใช้งาน

    ในการเริ่มต้นใช้งานโปรเจ็ค [HR-LINE-BOT] นั้น คุณต้องมี [รายชื่อซอฟต์แวร์ที่ต้องการติดตั้งเพื่อเริ่มต้นใช้งานโปรเจ็ค และวิธีการติดตั้ง]

### การติดตั้ง

    วิธีการติดตั้งโปรเจ็ค [HR-LINE-BOT] คือ
        1. ติดตั้ง NodeJS ผ่่านทาง https://nodejs.org/en โดย ณ เวลาที่พัฒนาตอนนี้คือ LTS 18.15.0
        2. ตรวจสอบว่าติดตั้งเรียบร้อยแล้วหรือไม่ด้วยการเปิด Command Prompt และพิมพ์คำสั่ง node --version
        3. เมื่อทำการติดตั้งเสร็จเรียบร้อยแล้วให้ไปที่ path ปัจจุบันของโปรเจ็กและใช้คำสั่ง npm i เพื่อติดตั้ง package ต่าง ๆ ที่อยู่ในไฟล์ package.json
        
    
### โครงสร้างโปรเจ็ค

        จุดเริ่มต้นของ application จะเล่นต้นที่ app.js โดย app.js จะเรียกใช้งาน module ที่ export ออกมา routes.js ซึ่ง routes.js จะเรียก route
    ย่อย ๆ ที่ถูกเรียกอีกที โดย route ย่อย ๆ จะขึ้นอยู่กับ HTTP Method ที่ส่งมาว่าเป็นอะไร (GET, POST หรือ PUT เป็นต้น) 
    โดยหลังจากเกิด HTTP Request มาไฟล์แรกที่จะถูกเรียกจาก "sub route" (<service.route.js>) จะอยู่ในส่วนของ "controller" ซึ่งลำดับถัดไป "controller" จะเรียกชั้น "service" และหลังจากนั้นเมื่อต้องการดำเนินการกับฐานข้อมูลชั้น "service" จะไปเรียกชั้น "repositories" เป็นลำดับสุดท้าย

    ****    ส่วนเหตุผลที่ต้องแยกโฟลเดอร์เป็นลำดับชั้นมีเหตุผลมาจากความต้องการแบ่งส่วนทำงาน เพื่อการวิเคราะห์และแก้ไขปัญหา รวมถึงการขยับขยายในอนาคต ***

    -> Root Directory
        - app.js       <-- entry point application 
        - src                
            - controllers     //   request and response management
                - <service_name>.controller.js           
                ...
            - services        //  business logic management
                - <service_name>.service.js           
                ...
            - repositories      // database query management
                - <service_name>.repository.js      
                ...     
            - db              // database management such as Models and database config
                - config       // config for database connection
                - migration    // migration files
                - models       // model for database
            - routes          //  routing and middleware
                - routes.js            // main routes
                - <service>.route.js           // sub routes   
        - .sequelizerc          // sequelize path configuration
        - package-lock.json
        - package.json
        - README_<language>.md
        - env_template.txt        // configuration for env here
         
### วิธีใช้งานโปรเจ็ค

วิธีใช้งานโปรเจ็ค [HR-LINE-BOT]

    1. ก่อนเริ่มต้นการใช้งานสิ่งที่ต้องคำนึงถึงอันดับแรกคือ "environment" เพราะหากไม่ได้กำหนดค่าตรงส่วนนี้เป็นอันดับแรกก็จะไม่สามารถใช้งานได้
        1.1 ทำการตรวจสอบ env_template 
        1.2 สร้างไฟล์นามสกุล ".env" และนำค่าจากข้อ 1.1 มาใส่
        1.3 ในกรณีที่เป็น "env" เป็น "development" สามารถใช้คำสั่ง "npm i" และ "sequelize db:migrate" ได้เลย
    2. ตัวโปรเจ็คนอกจากจะอ่านเขียนข้อมูลที่ฝั่ง RDBMS แล้วนั้นยังมีการอ่านเขียนข้อมูลรองไปยัง "googlesheet"              เพื่อช่วยให้ผู้ใช้สามารถดึงข้อมูลลงไปทำรายงานได้สะดวกยิ่งขึ้น
        2.1 ตรงส่วนนี้นั้นจำเป็นต้องทำการกำหนด "env" ที่มีตัวแปรชื่อว่า "SPREAD_SHEET_ID"
        2.2 จำเป็นต้องนำไฟล์ config ของ googlesheet ที่จะระบุ Key และ Credential ต่าง ๆ เอาไว้ โดยสามารถสร้างไฟล์ชื่อ "credentials.json" ไว้ที่ root directory ของโปรเจ็ค (ระดับเดียวกับ app.js) และนำค่ามาใส่ลงไป 
        2.3 ค่าของ credentials.json สามารถหาได้จาก googlesheet developer console 
    3. ตัวโปรเจ็คมีการทำงานร่วมกับ FTP Server เพื่อลดภาระค่าใช้จ่าย storage ทั้งของ Googledrive และ Hosting จึงได้มีการโยกย้ายไฟล์หลัง user ดำเนินการเสร็จแล้วไปที่ FTP Server
        3.1 การทำงานส่วนนี้สามารถดูได้ที่ "/repositories/ftp-rw.repository.js"
    4. เนื่องจากโปรเจ็คนี้มีการทำงานร่วมกับ LINE Messaging API โดยตรง ผู้ใช้งานจำเป็นจะต้องระบุ "ACCESS_TOKEN" และ "SECRET_TOKEN" จากทางฝั่ง LINE ด้วย ค่าตรงนี้สามารถหาได้จาก LINE Developer Console รายละเอียดเพิ่มเติมสามารถอ่านได้จากเอกสารของ LINE Messaging API
    5. เมื่อดำเนินการกำหนดค่า environment ต่าง ๆ เรียบร้อยแล้วสามารถใช้คำสั่ง "node app.js" หรือถ้าต้องการทดสอบแบบ hot reload ให้ใช้คำสั่ง "nodemon app.js"


## ผู้เขียน
* [Mr.Thossaporn Sukprasomjit] - [kimjonggod@hotmail.com] Thailand GMT+7 
