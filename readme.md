Criação de uma nova coluna na categoria 

=> criar uma migration exe: "yarn sequelize migration:create --name add-path-column" adiciona uma coluna para por arquivo de imagem
=> cria a migration => "20250925163929-add-path-column.js"

=> fazer a alteração da model relacionada no caso a "Category.js"

=> mudar a rota para por file : "upload.single('file')"