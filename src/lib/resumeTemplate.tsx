import { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CurriculoPayload, ProfissionalContext, TemplateId } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: CLÁSSICO
// Header centralizado · Seções em caixa-alta com linha inferior · Empresa em
// negrito/caixa-alta seguida de cargo+período — no estilo de referência (ATS).
// ─────────────────────────────────────────────────────────────────────────────

const cColors = {
  name:    '#262626',
  section: '#262626',
  body:    '#111111',
  muted:   '#595959',
  rule:    '#A6A6A6',
  white:   '#ffffff',
};

const cStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: cColors.white,
    fontSize: 9.3,
    color: cColors.body,
    paddingHorizontal: 44,
    paddingTop: 30,
    paddingBottom: 30,
  },

  // Header — centralizado, como no modelo de referência
  header: { alignItems: 'center', marginBottom: 9 },
  headerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 19,
    color: cColors.name,
    marginBottom: 2,
    textAlign: 'center',
  },
  headerTitle: { fontSize: 9.3, color: cColors.muted, marginBottom: 4, textAlign: 'center' },
  headerContactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  headerContact: { fontSize: 7.8, color: cColors.muted },
  headerContactSep: { fontSize: 7.8, color: cColors.rule, marginHorizontal: 5 },

  // Section
  section: { marginBottom: 7 },
  sectionHeader: {
    borderBottomWidth: 1.1,
    borderBottomColor: cColors.rule,
    paddingBottom: 2,
    marginBottom: 4.5,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.2,
    color: cColors.section,
    textTransform: 'uppercase',
  },

  // Experience
  expBlock: { marginBottom: 5 },
  expCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.4,
    color: cColors.body,
    textTransform: 'uppercase',
    marginBottom: 1.5,
  },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2.5 },
  expRole: { fontSize: 8.4, color: cColors.muted, flex: 1, paddingRight: 8 },
  expDate: { fontSize: 7.8, color: cColors.muted, textAlign: 'right' },
  bulletRow: { flexDirection: 'row', marginBottom: 1.2, paddingRight: 4 },
  bulletDot: { fontSize: 7.8, color: cColors.body, marginRight: 6, marginTop: 0.5 },
  bulletText: { fontSize: 8.2, lineHeight: 1.3, color: cColors.body, flex: 1 },
  expSep: { height: 0.5, backgroundColor: '#e0e0e0', marginVertical: 4 },

  // Skills
  skillRow: { flexDirection: 'row', marginBottom: 1.5 },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.2,
    color: cColors.body,
    width: 112,
  },
  skillValue: { fontSize: 8.2, lineHeight: 1.3, color: cColors.body, flex: 1 },

  // Education
  eduBlock: { marginBottom: 4 },
  eduTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eduInstitution: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.1,
    color: cColors.body,
    textTransform: 'uppercase',
    flex: 1,
    paddingRight: 8,
  },
  eduPeriod: { fontSize: 7.8, color: cColors.muted, textAlign: 'right' },
  eduTitle: { fontSize: 8.4, color: cColors.muted, marginTop: 1 },

  // Projects
  projectBlock: { marginBottom: 3 },
  projectTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.8, color: cColors.body, marginBottom: 1 },
  projectDesc: { fontSize: 8.1, lineHeight: 1.2, color: cColors.body, textAlign: 'justify' },

  // Courses
  cursoBlock: { marginBottom: 2.5 },
  cursoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0.5 },
  cursoTitulo: { fontFamily: 'Helvetica-Bold', fontSize: 8.3, color: cColors.body, flex: 1, paddingRight: 8 },
  cursoPeriodo: { fontSize: 7.1, color: cColors.muted, textAlign: 'right' },
  cursoPlataforma: { fontSize: 7.6, color: cColors.muted, marginBottom: 0.5 },
  cursoTopicos: { fontSize: 7.6, color: cColors.body },
  cursoSep: { height: 0.5, backgroundColor: '#e0e0e0', marginVertical: 2 },

  // Summary
  summaryText: { fontSize: 9, lineHeight: 1.25, color: cColors.body, textAlign: 'justify' },
});

function CSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={cStyles.section}>
      <View style={cStyles.sectionHeader}>
        <Text style={cStyles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function CExpBlock({ empresa, bullets, separator = false }: {
  empresa: { nome: string; cargo: string; periodo: string };
  bullets: string[];
  separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={cStyles.expSep} />}
      <View style={cStyles.expBlock}>
        <Text style={cStyles.expCompany}>{empresa.nome}</Text>
        <View style={cStyles.expTopRow}>
          <Text style={cStyles.expRole}>{empresa.cargo}</Text>
          <Text style={cStyles.expDate}>{empresa.periodo}</Text>
        </View>
        {bullets.map((b, i) => (
          <View key={i} style={cStyles.bulletRow}>
            <Text style={cStyles.bulletDot}>•</Text>
            <Text style={cStyles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildClassico(payload: CurriculoPayload, ctx: ProfissionalContext) {
  const titulo = payload.titulo ?? ctx.titulo;
  const empresaFrog = { ...ctx.empresas[0], cargo: payload.cargo_frog ?? ctx.empresas[0].cargo };
  const empresaBrasmid = { ...ctx.empresas[1], cargo: payload.cargo_brasmid ?? ctx.empresas[1].cargo };
  const empresaAapvr = { ...ctx.empresas[2], cargo: payload.cargo_aapvr ?? ctx.empresas[2].cargo };

  const contactItems: { text: string; link?: string }[] = [
    { text: ctx.localizacao },
    { text: ctx.telefone },
    { text: ctx.email },
    { text: ctx.linkedin },
    { text: ctx.github },
    ...(ctx.portfolio ? [{ text: ctx.portfolio, link: ctx.portfolio }] : []),
  ];

  return (
    <Document title={`Curriculo - ${ctx.nome}`} language="pt-BR">
      <Page size="A4" style={cStyles.page}>
        {/* Header centralizado */}
        <View style={cStyles.header}>
          <Text style={cStyles.headerName}>{ctx.nome}</Text>
          <Text style={cStyles.headerTitle}>{titulo}</Text>
          <View style={cStyles.headerContactRow}>
            {contactItems.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && <Text style={cStyles.headerContactSep}>|</Text>}
                {item.link ? (
                  <Link src={item.link} style={cStyles.headerContact}>{item.text}</Link>
                ) : (
                  <Text style={cStyles.headerContact}>{item.text}</Text>
                )}
              </Fragment>
            ))}
          </View>
        </View>

        {/* Resumo */}
        <CSection title="Resumo Profissional">
          <Text style={cStyles.summaryText}>{payload.resumo}</Text>
        </CSection>

        {/* Experiência */}
        <CSection title="Experiência Profissional">
          <CExpBlock empresa={empresaFrog} bullets={payload.exp_frog_bullets} />
          <CExpBlock empresa={empresaBrasmid} bullets={payload.exp_brasmid_bullets} separator />
          <CExpBlock empresa={empresaAapvr} bullets={payload.exp_aapvr_bullets} separator />
        </CSection>

        {/* Habilidades */}
        <CSection title="Habilidades Técnicas">
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Back-End:</Text><Text style={cStyles.skillValue}>{payload.hab_back}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Front-End:</Text><Text style={cStyles.skillValue}>{payload.hab_front}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Bancos de Dados:</Text><Text style={cStyles.skillValue}>{payload.hab_db}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Infraestrutura e DevOps:</Text><Text style={cStyles.skillValue}>{payload.hab_devops}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Arquitetura e IA:</Text><Text style={cStyles.skillValue}>{payload.hab_arq}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Segurança:</Text><Text style={cStyles.skillValue}>{payload.hab_seg}</Text></View>
          {payload.hab_soft && (
            <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Soft Skills e Metodologias:</Text><Text style={cStyles.skillValue}>{payload.hab_soft}</Text></View>
          )}
        </CSection>

        {/* Formação */}
        <CSection title="Formação Acadêmica">
          {ctx.educacao.map((edu, i) => (
            <View key={i} style={cStyles.eduBlock} wrap={false}>
              <View style={cStyles.eduTopRow}>
                <Text style={cStyles.eduInstitution}>{edu.instituicao}</Text>
                <Text style={cStyles.eduPeriod}>{edu.periodo}</Text>
              </View>
              <Text style={cStyles.eduTitle}>{edu.titulo}</Text>
            </View>
          ))}
        </CSection>

        {/* Cursos e Certificações — a IA decide se inclui, com base na relevância para a vaga */}
        {payload.cursos && payload.cursos.length > 0 && (
          <CSection title="Cursos e Certificações">
            {payload.cursos.map((c, i) => (
              <View key={i} wrap={false}>
                {i > 0 && <View style={cStyles.cursoSep} />}
                <View style={cStyles.cursoBlock}>
                  <View style={cStyles.cursoTopRow}>
                    <Text style={cStyles.cursoTitulo}>{c.titulo}</Text>
                    <Text style={cStyles.cursoPeriodo}>{c.periodo}</Text>
                  </View>
                  <Text style={cStyles.cursoPlataforma}>
                    {c.plataforma}
                    {c.topicos ? `  —  ${c.topicos}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </CSection>
        )}

        {/* Projetos — quantidade decidida pela IA conforme relevância para a vaga */}
        {payload.projetos_destaque && payload.projetos_destaque.length > 0 && (
          <CSection title="Projetos e Desenvolvimento Contínuo">
            {payload.projetos_destaque.map((p, i) => (
              <View key={i} style={cStyles.projectBlock} wrap={false}>
                <Text style={cStyles.projectTitle}>{p.titulo}</Text>
                <Text style={cStyles.projectDesc}>{p.descricao}</Text>
              </View>
            ))}
          </CSection>
        )}
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: MINIMALISTA
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: MODERNO
// Barra de destaque colorida no topo · Cabeçalho à esquerda · Títulos de seção
// coloridos sem borda · Datas em itálico · Habilidades em parágrafo corrido.
// ─────────────────────────────────────────────────────────────────────────────

const mColors = {
  accent: '#2F6F87',
  accentLight: '#5B95A8',
  name: '#1F2937',
  body: '#1F2937',
  muted: '#6B7280',
  rule: '#DCE2E6',
  white: '#ffffff',
};

const mStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: mColors.white, fontSize: 9, color: mColors.body, paddingHorizontal: 44, paddingTop: 0, paddingBottom: 24 },
  topBar: { height: 4.5, backgroundColor: mColors.accent, marginHorizontal: -44, marginBottom: 12 },

  headerName: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: mColors.name, marginBottom: 1.5 },
  headerTitle: { fontSize: 9.3, color: mColors.accent, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  headerContactRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 9 },
  headerContact: { fontSize: 7.6, color: mColors.muted },
  headerContactSep: { fontSize: 7.6, color: mColors.accentLight, marginHorizontal: 5 },

  section: { marginBottom: 7 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: mColors.accent, textTransform: 'uppercase', marginBottom: 4 },
  summaryText: { fontSize: 8.6, lineHeight: 1.3, color: mColors.body, textAlign: 'justify' },

  expBlock: { marginBottom: 4 },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCompany: { fontFamily: 'Helvetica-Bold', fontSize: 8.9, color: mColors.name },
  expDate: { fontSize: 7.7, color: mColors.muted, fontStyle: 'italic' },
  expRole: { fontSize: 8.1, color: mColors.muted, fontStyle: 'italic', marginBottom: 2, marginTop: 0.5 },
  expSep: { height: 0.5, backgroundColor: mColors.rule, marginVertical: 3.5 },
  bulletRow: { flexDirection: 'row', marginBottom: 1, paddingRight: 4 },
  bulletDot: { fontSize: 7.6, color: mColors.accent, marginRight: 6, marginTop: 0.5 },
  bulletText: { fontSize: 7.9, lineHeight: 1.25, color: mColors.body, flex: 1 },

  projectBlock: { marginBottom: 3 },
  projectTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.6, color: mColors.name, marginBottom: 1 },
  projectDesc: { fontSize: 7.9, lineHeight: 1.25, color: mColors.body, textAlign: 'justify' },

  skillPara: { fontSize: 7.9, lineHeight: 1.3, color: mColors.body, marginBottom: 1.5 },
  skillLabelInline: { fontFamily: 'Helvetica-Bold', color: mColors.name },

  eduBlock: { marginBottom: 3 },
  eduTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eduTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.9, color: mColors.name, flex: 1, paddingRight: 8 },
  eduDate: { fontSize: 7.7, color: mColors.muted, fontStyle: 'italic' },
  eduInstitution: { fontSize: 8, color: mColors.muted, fontStyle: 'italic', marginTop: 0.5 },

  cursoBlock: { marginBottom: 3 },
  cursoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cursoTitulo: { fontFamily: 'Helvetica-Bold', fontSize: 8.6, color: mColors.name, flex: 1, paddingRight: 8 },
  cursoPeriodo: { fontSize: 7.7, color: mColors.muted, fontStyle: 'italic' },
  cursoPlataforma: { fontSize: 7.9, color: mColors.muted, fontStyle: 'italic', marginTop: 0.5 },
});

function MSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={mStyles.section}>
      <Text style={mStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MExpBlock({ empresa, bullets, separator = false }: {
  empresa: { nome: string; cargo: string; periodo: string };
  bullets: string[];
  separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={mStyles.expSep} />}
      <View style={mStyles.expBlock}>
        <View style={mStyles.expTopRow}>
          <Text style={mStyles.expCompany}>{empresa.nome}</Text>
          <Text style={mStyles.expDate}>{empresa.periodo}</Text>
        </View>
        <Text style={mStyles.expRole}>{empresa.cargo}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={mStyles.bulletRow}>
            <Text style={mStyles.bulletDot}>•</Text>
            <Text style={mStyles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildModerno(payload: CurriculoPayload, ctx: ProfissionalContext) {
  const titulo = payload.titulo ?? ctx.titulo;
  const empresaFrog = { ...ctx.empresas[0], cargo: payload.cargo_frog ?? ctx.empresas[0].cargo };
  const empresaBrasmid = { ...ctx.empresas[1], cargo: payload.cargo_brasmid ?? ctx.empresas[1].cargo };
  const empresaAapvr = { ...ctx.empresas[2], cargo: payload.cargo_aapvr ?? ctx.empresas[2].cargo };

  const contactItems: { text: string; link?: string }[] = [
    { text: ctx.localizacao },
    { text: ctx.telefone },
    { text: ctx.email },
    { text: ctx.linkedin },
    { text: ctx.github },
    ...(ctx.portfolio ? [{ text: ctx.portfolio, link: ctx.portfolio }] : []),
  ];

  return (
    <Document title={`Curriculo - ${ctx.nome}`} language="pt-BR">
      <Page size="A4" style={mStyles.page}>
        <View style={mStyles.topBar} />

        <Text style={mStyles.headerName}>{ctx.nome}</Text>
        <Text style={mStyles.headerTitle}>{titulo}</Text>
        <View style={mStyles.headerContactRow}>
          {contactItems.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <Text style={mStyles.headerContactSep}>·</Text>}
              {item.link ? (
                <Link src={item.link} style={mStyles.headerContact}>{item.text}</Link>
              ) : (
                <Text style={mStyles.headerContact}>{item.text}</Text>
              )}
            </Fragment>
          ))}
        </View>

        <MSection title="Resumo Profissional">
          <Text style={mStyles.summaryText}>{payload.resumo}</Text>
        </MSection>

        <MSection title="Experiência Profissional">
          <MExpBlock empresa={empresaFrog} bullets={payload.exp_frog_bullets} />
          <MExpBlock empresa={empresaBrasmid} bullets={payload.exp_brasmid_bullets} separator />
          <MExpBlock empresa={empresaAapvr} bullets={payload.exp_aapvr_bullets} separator />
        </MSection>

        <MSection title="Formação Acadêmica">
          {ctx.educacao.map((edu, i) => (
            <View key={i} style={mStyles.eduBlock} wrap={false}>
              <View style={mStyles.eduTopRow}>
                <Text style={mStyles.eduTitle}>{edu.titulo}</Text>
                <Text style={mStyles.eduDate}>{edu.periodo}</Text>
              </View>
              <Text style={mStyles.eduInstitution}>{edu.instituicao}</Text>
            </View>
          ))}
        </MSection>

        <MSection title="Habilidades Técnicas">
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Back-End: </Text>{payload.hab_back}</Text>
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Front-End: </Text>{payload.hab_front}</Text>
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Bancos de Dados: </Text>{payload.hab_db}</Text>
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Infraestrutura e DevOps: </Text>{payload.hab_devops}</Text>
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Arquitetura e IA: </Text>{payload.hab_arq}</Text>
          <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Segurança: </Text>{payload.hab_seg}</Text>
          {payload.hab_soft && (
            <Text style={mStyles.skillPara}><Text style={mStyles.skillLabelInline}>Soft Skills e Metodologias: </Text>{payload.hab_soft}</Text>
          )}
        </MSection>

        {/* Cursos e Certificações — a IA decide se inclui, com base na relevância para a vaga */}
        {payload.cursos && payload.cursos.length > 0 && (
          <MSection title="Cursos e Certificações">
            {payload.cursos.map((c, i) => (
              <View key={i} style={mStyles.cursoBlock} wrap={false}>
                <View style={mStyles.cursoTopRow}>
                  <Text style={mStyles.cursoTitulo}>{c.titulo}</Text>
                  <Text style={mStyles.cursoPeriodo}>{c.periodo}</Text>
                </View>
                <Text style={mStyles.cursoPlataforma}>
                  {c.plataforma}
                  {c.topicos ? `  —  ${c.topicos}` : ''}
                </Text>
              </View>
            ))}
          </MSection>
        )}

        {/* Projetos — quantidade decidida pela IA conforme relevância para a vaga */}
        {payload.projetos_destaque && payload.projetos_destaque.length > 0 && (
          <MSection title="Projetos e Desenvolvimento Contínuo">
            {payload.projetos_destaque.map((p, i) => (
              <View key={i} style={mStyles.projectBlock} wrap={false}>
                <Text style={mStyles.projectTitle}>{p.titulo}</Text>
                <Text style={mStyles.projectDesc}>{p.descricao}</Text>
              </View>
            ))}
          </MSection>
        )}
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATES: Record<TemplateId, { label: string; description: string }> = {
  classico:  { label: 'Clássico', description: 'Cabeçalho centralizado, seções em caixa-alta com linha inferior, preto e branco. ATS-friendly.' },
  moderno:   { label: 'Moderno',  description: 'Barra de destaque colorida, cabeçalho à esquerda, datas em itálico. Estilo editorial moderno.' },
};

export function buildCurriculoDocument(
  payload: CurriculoPayload,
  context: ProfissionalContext,
  template: TemplateId = 'classico'
) {
  switch (template) {
    case 'moderno': return buildModerno(payload, context);
    default:            return buildClassico(payload, context);
  }
}
