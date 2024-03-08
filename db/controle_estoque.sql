CREATE TABLE clientes_fornecedores (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    cpf_cnpj character varying(20) NOT NULL,
    tipo character(1) NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    CONSTRAINT clientes_fornecedores_tipo_check CHECK ((tipo = ANY (ARRAY['F'::bpchar, 'C'::bpchar])))
);


ALTER TABLE clientes_fornecedores OWNER TO postgres;


CREATE SEQUENCE clientes_fornecedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE clientes_fornecedores_id_seq OWNER TO postgres;


ALTER SEQUENCE clientes_fornecedores_id_seq OWNED BY clientes_fornecedores.id;


CREATE TABLE estoque (
    id integer NOT NULL,
    produto_id integer,
    quantidade integer NOT NULL,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE estoque OWNER TO postgres;


CREATE SEQUENCE estoque_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE estoque_id_seq OWNER TO postgres;


ALTER SEQUENCE estoque_id_seq OWNED BY estoque.id;



CREATE TABLE produtos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    quantidade_de_estoque integer DEFAULT 0,
    limite_estoque_baixo integer DEFAULT 0,
    preco_compra numeric(10,2)
);


ALTER TABLE produtos OWNER TO postgres;



CREATE SEQUENCE produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE produtos_id_seq OWNER TO postgres;


ALTER SEQUENCE produtos_id_seq OWNED BY produtos.id;



CREATE TABLE registro_estoque (
    id integer NOT NULL,
    produto_id integer NOT NULL,
    quantidade integer NOT NULL,
    tipo character varying(10),
    nome_cliente character varying(255),
    data_operacao timestamp without time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    cliente_fornecedor_id integer,
    CONSTRAINT registro_estoque_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['entrada'::character varying, 'saida'::character varying])::text[])))
);


ALTER TABLE registro_estoque OWNER TO postgres;


CREATE SEQUENCE registro_estoque_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE registro_estoque_id_seq OWNER TO postgres;


ALTER SEQUENCE registro_estoque_id_seq OWNED BY registro_estoque.id;



CREATE TABLE usuarios (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE usuarios OWNER TO postgres;


CREATE SEQUENCE usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuarios_id_seq OWNER TO postgres;


ALTER SEQUENCE usuarios_id_seq OWNED BY usuarios.id;



ALTER TABLE ONLY clientes_fornecedores ALTER COLUMN id SET DEFAULT nextval('clientes_fornecedores_id_seq'::regclass);



ALTER TABLE ONLY estoque ALTER COLUMN id SET DEFAULT nextval('estoque_id_seq'::regclass);



ALTER TABLE ONLY produtos ALTER COLUMN id SET DEFAULT nextval('produtos_id_seq'::regclass);


ALTER TABLE ONLY registro_estoque ALTER COLUMN id SET DEFAULT nextval('registro_estoque_id_seq'::regclass);

ALTER TABLE ONLY usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq'::regclass);


ALTER TABLE ONLY clientes_fornecedores
    ADD CONSTRAINT clientes_fornecedores_pkey PRIMARY KEY (id);

ALTER TABLE ONLY clientes_fornecedores
    ADD CONSTRAINT cpf_cnpj_unique UNIQUE (cpf_cnpj);


ALTER TABLE ONLY estoque
    ADD CONSTRAINT estoque_pkey PRIMARY KEY (id);


ALTER TABLE ONLY estoque
    ADD CONSTRAINT estoque_produto_id_key UNIQUE (produto_id);


ALTER TABLE ONLY produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


ALTER TABLE ONLY registro_estoque
    ADD CONSTRAINT registro_estoque_pkey PRIMARY KEY (id);


ALTER TABLE ONLY usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


ALTER TABLE ONLY usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


ALTER TABLE ONLY estoque
    ADD CONSTRAINT estoque_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES produtos(id);


ALTER TABLE ONLY registro_estoque
    ADD CONSTRAINT fk_cliente_fornecedor FOREIGN KEY (cliente_fornecedor_id) REFERENCES clientes_fornecedores(id) ON DELETE SET NULL;


ALTER TABLE ONLY registro_estoque
    ADD CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE;


REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;

