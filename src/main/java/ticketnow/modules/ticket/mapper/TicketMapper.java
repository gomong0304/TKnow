package ticketnow.modules.ticket.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import ticketnow.modules.ticket.dto.TicketResponseDTO;

@Mapper
public interface TicketMapper {

    // INSERT (Map 기반, useGeneratedKeys 로 ticketId 채워짐)
    int insertTicketFromMap(Map<String, Object> params);

    // 단건 DTO 조회
    TicketResponseDTO selectTicketDTOById(@Param("ticketId") Long ticketId);

    // 페이지 DTO 조회
    List<TicketResponseDTO> selectTicketDTOPage(@Param("offset") int offset,
                                                @Param("limit")  int limit);

    // 총 개수
    long countTickets();

    // 부분 수정
    int updateTicketFromMap(Map<String, Object> params);
    
    // 티켓 상태만 단순 변경 (예: 자동 판매 종료)
    int updateTicketStatus(@Param("ticketId") Long ticketId,
                           @Param("ticketStatus") String ticketStatus);

    
    // 소프트 삭제 대체: 상태 CLOSED 전환
    // int softDeleteTicket(@Param("ticketId") Long ticketId);
    
    /**
     * 티켓 물리 삭제 (DELETE FROM ticket ...)
     * @param ticketId 삭제할 티켓 PK
     * @return 삭제된 행 수 (0 또는 1)
     */
    int hardDeleteTicket(@Param("ticketId") Long ticketId);
}