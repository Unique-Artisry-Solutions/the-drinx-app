-- Assign test establishment users as owners of existing establishments
-- This will make venues appear in promoter contacts for testing

-- Assign testbar user to first 5 establishments
UPDATE establishments 
SET owner_id = '6531c6f1-9aa8-4f7e-9e5e-cf29b85455f6'
WHERE id IN (
  '9f5c8180-844b-4fab-8df1-47cf76be4b1c',
  '107879b3-b65c-401b-ada9-dcaa4b62ff63', 
  '202aa105-9d24-4bfd-87de-b80608852ebd',
  '390c83f5-619b-4a76-bcc6-e5f252b1658f',
  'b44e9561-4a6a-4b2c-8cab-7ca95930091a'
);

-- Assign testestablishment user to next 5 establishments  
UPDATE establishments
SET owner_id = '3a077b83-d859-466a-affb-2f87f52c3a6e'
WHERE id IN (
  '9dffc2b7-e0f9-47a1-a7b4-7fc2be445986',
  'ab973d54-d75b-4cdb-ad3c-a65e63090da9',
  '57c9d917-3be0-4b52-97fc-1f4772c338ae', 
  'a453a4d8-970a-469a-a443-0ae5fa01c8c1',
  '67b6df7f-da30-47de-8945-0a58c490acf6'
);