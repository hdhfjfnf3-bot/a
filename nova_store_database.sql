--
-- PostgreSQL database dump
--



-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
);


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'user',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    slug text NOT NULL,
    icon text,
    image text
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    product_id integer NOT NULL,
    full_name text NOT NULL,
    phone text NOT NULL,
    alt_phone text,
    governorate text NOT NULL,
    address text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    facebook_page text,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    description text,
    description_ar text,
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    images json DEFAULT '[]'::json NOT NULL,
    category_id integer,
    stock integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    badge text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name text NOT NULL,
    phone text NOT NULL,
    password text NOT NULL,
    role public.role DEFAULT 'user'::public.role NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (id, name, name_ar, slug, icon, image) VALUES (1, 'Clothing', 'ملابس', 'clothing', '👗', '/images/nova-hero.png');
INSERT INTO public.categories (id, name, name_ar, slug, icon, image) VALUES (2, 'Perfumes', 'عطور', 'perfumes', '🌹', '/images/nova-hero.png');
INSERT INTO public.categories (id, name, name_ar, slug, icon, image) VALUES (3, 'Home Tools', 'أدوات منزلية', 'home-tools', '🏠', '/images/nova-hero.png');
INSERT INTO public.categories (id, name, name_ar, slug, icon, image) VALUES (4, 'Electronics', 'إلكترونيات', 'electronics', '📱', '/images/nova-hero.png');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (1, 'Elegant Abaya', 'عباية أنيقة فاخرة', 'A stunning elegant abaya', 'عباية أنيقة فاخرة مصنوعة من أجود أنواع القماش', 350.00, 500.00, '["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"]', 1, 50, true, 'الأكثر مبيعاً', '2026-03-15 01:17:21.871697');
INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (2, 'Royal Oud Perfume', 'عطر العود الملكي', 'Premium oud perfume', 'عطر عود ملكي فاخر يدوم طويلاً', 280.00, 400.00, '["https://images.unsplash.com/photo-1541643600914-78b084683702?w=600"]', 2, 30, true, 'جديد', '2026-03-15 01:17:21.916187');
INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (3, 'Smart Kitchen Blender', 'خلاط مطبخ ذكي', 'Powerful kitchen blender', 'خلاط مطبخ قوي متعدد الوظائف', 199.00, 299.00, '["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600"]', 3, 20, true, 'خصم 33%', '2026-03-15 01:17:21.956058');
INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (4, 'Wireless Earbuds Pro', 'سماعات لاسلكية برو', 'Premium wireless earbuds', 'سماعات لاسلكية فاخرة عالية الجودة', 450.00, 650.00, '["https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600"]', 4, 15, true, 'تخفيض', '2026-03-15 01:17:21.999676');
INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (5, 'Summer Dress', 'فستان صيفي زاهي', 'Beautiful summer dress', 'فستان صيفي جميل بألوان زاهية', 220.00, 320.00, '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"]', 1, 40, false, NULL, '2026-03-15 01:17:22.043364');
INSERT INTO public.products (id, name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge, created_at) VALUES (6, 'French Perfume', 'عطر فرنسي مميز', 'Luxury French perfume', 'عطر فرنسي فاخر برائحة مميزة', 320.00, NULL, '["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600"]', 2, 25, false, NULL, '2026-03-15 01:17:22.081976');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, full_name, phone, password, role, created_at) VALUES (1, 'Nova Admin', '201000000000', '$2b$10$zUqZkJnLr6Dfm16n.db3UOKrmhyGVqE6SPcd8fMju76pkWxAG.TSu', 'admin', '2026-03-15 01:16:56.427678');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_unique UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders orders_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

